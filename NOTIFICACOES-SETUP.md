# Notificações push reais — guia de configuração

Isto faz o tlm avisar-te (mesmo com a app fechada) às **11:30, 15:00, 17:00,
19:00, 21:30 e 23:00** (hora de Lisboa) *só* se ainda tiveres rotinas por
fazer. O aviso das 11:30 é especial: só conta rotinas com sub-horário
"Manhã" por fazer. O das 17:00 mostra sempre a frase fixa "Não te esqueças
das rotinas!" em vez da contagem. Também avisa perto da hora de cada
**evento da Agenda** que tenha hora marcada (ex: "11:00 — Estudar Mercado"),
no dia certo, seja qual for a hora do evento. Não há login — é só o teu
telemóvel a guardar um registo simples numa base de dados
gratuita, para um robô agendado (GitHub Actions) conseguir verificar e enviar
a notificação.

Como funciona, em resumo:

1. O tlm, no teu telemóvel, subscreve-se a notificações push e guarda essa
   subscrição + quantas rotinas faltam num projeto Supabase (grátis).
2. Um GitHub Action corre automaticamente a horas fixas, olha para essa tabela
   e, se houver rotinas por fazer, manda-te a notificação a sério.
3. Nada disto tem password nem conta de utilizador — é tudo automático a partir
   do momento em que configures as chaves abaixo.

Tens de fazer isto uma vez só. São ~15 minutos.

## 1. Criar o projeto Supabase

1. Vai a [supabase.com](https://supabase.com) e cria uma conta grátis (dá para usar o GitHub para entrar).
2. Cria um novo projeto (nome à tua escolha, ex: `tlm`). Escolhe uma password de base de dados qualquer — não vais precisar dela.
3. Espera ~1-2 minutos até o projeto ficar pronto.

## 2. Criar a tabela

No projeto, vai a **SQL Editor** (barra lateral) → **New query**, cola isto e clica em **Run**:

```sql
create table if not exists tlm_devices (
  id text primary key,
  subscription jsonb,
  incomplete_count integer default 0,
  incomplete_text text default '',
  updated_at timestamptz default now()
);

alter table tlm_devices enable row level security;

-- o telemóvel só pode criar/atualizar o seu próprio registo, nunca ler nenhum
create policy "tlm anon insert" on tlm_devices
  for insert to anon
  with check (true);

create policy "tlm anon update" on tlm_devices
  for update to anon
  using (true);
```

Isto garante que a chave pública que vai ficar no site só serve para escrever
o teu próprio estado, nunca para ler dados de ninguém.

## 3. Ir buscar as chaves

Em **Project Settings → API**, vais precisar de três valores:

- **Project URL** (ex: `https://xxxxxxxx.supabase.co`)
- **anon public** key (esta é suposta ficar visível no site, não é secreta)
- **service_role** key (esta sim é secreta — nunca a metas no `app.js` nem em nenhum ficheiro público, só no GitHub Secrets no passo 5)

## 4. Preencher o `app.js`

Abre `app.js`, no topo do ficheiro, e substitui estas duas linhas pelos teus valores do passo 3:

```js
const SUPABASE_URL = "COLOCA_AQUI_O_URL_DO_PROJETO_SUPABASE";
const SUPABASE_ANON_KEY = "COLOCA_AQUI_A_ANON_KEY_DO_SUPABASE";
```

A `VAPID_PUBLIC_KEY` já está preenchida — não precisas de mexer nela.

## 5. Configurar os GitHub Secrets

No repositório do tlm no GitHub: **Settings → Secrets and variables → Actions → New repository secret**, e cria estes 5 secrets:

| Nome | Valor |
|---|---|
| `SUPABASE_URL` | o mesmo Project URL do passo 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | a service_role key do passo 3 |
| `VAPID_PUBLIC_KEY` | `BIeMFEQkCSZpiYCESxHLqPNnUselCxbs7I_GzMv2zJpJBD2g28LdeAqVS8D_HCWSjSmNo_rCCxo5XYG45KA4SME` |
| `VAPID_PRIVATE_KEY` | `oC692fhL9yCov1INHCAGI8_Km6r_0sE3JGAcrTWQF7w` |
| `VAPID_SUBJECT` | `mailto:o-teu-email@exemplo.com` (qualquer email teu, é só exigido pelo protocolo) |

⚠️ A `VAPID_PRIVATE_KEY` acima foi gerada especificamente para o teu tlm — não a
partilhes fora daqui, e não a ponhas em nenhum ficheiro do site (só neste
secret do GitHub).

## 6. Publicar

Faz commit e push dos ficheiros como já costumas fazer (`app.js`,
`.github/workflows/notify.yml`, `notify/`).

## 7. Testar

1. Abre o tlm no telemóvel, vai à Início e toca em **"Ativar avisos"** no aviso
   de rotinas por fazer (ou aceita a permissão de notificações quando for
   pedida). Isto subscreve o teu telemóvel.
2. No GitHub, vai ao separador **Actions → Notificações tlm → Run workflow**
   para correr o robô manualmente na hora, sem esperar pelas 15h/19h/21:30 —
   útil só para testares. Se tiveres rotinas por fazer nesse momento, deves
   receber a notificação em segundos.

## Limitações a saber

- Só funciona depois de teres aberto a app pelo menos uma vez e aceite a
  permissão de notificações — isso é o que cria a subscrição.
- O plano grátis do Supabase pausa o projeto ao fim de ~7 dias sem nenhum
  pedido. Se isso acontecer, aparece "Paused" na página do projeto — clica em
  "Restore project" para reativar, e volta a abrir o tlm no telemóvel.
- No iPhone, isto só funciona com o tlm adicionado ao ecrã principal (já
  tens isso feito).
- As 12 horas agendadas no workflow (2 por hora-alvo) cobrem tanto o horário
  de inverno como o de verão automaticamente — não precisas de mexer nisso
  duas vezes por ano.
- A tabela `tlm_devices` está sem RLS (proteção ao nível de linha) — decidimos
  isto de propósito para simplificar, porque não guarda dados sensíveis (só a
  contagem de rotinas por fazer e o endereço de notificação do telemóvel).

## Adicionar mais horas ou tipos de aviso

Se um dia quiseres mais horas, ou outro tipo de aviso (ex: só rotinas da
tarde), a tabela `tlm_devices` já tem estas colunas:

```sql
alter table tlm_devices add column if not exists incomplete_morning_count integer default 0;
alter table tlm_devices add column if not exists incomplete_morning_text text default '';
```

Corre isto no SQL Editor se ainda não o fizeste (é preciso para o aviso das
11:30 funcionar). Depois, `TARGET_TIMES` em `notify/send-notifications.js` é
onde se definem as horas, tipos e textos fixos.

## Notificações de eventos da Agenda

Para os avisos de eventos da Agenda funcionarem, a tabela `tlm_devices`
precisa de mais uma coluna. Corre isto no SQL Editor (uma vez só):

```sql
alter table tlm_devices add column if not exists agenda_events jsonb default '[]'::jsonb;
```

Como funciona: sempre que crias, apagas ou tocas num evento com hora na
Agenda, o tlm envia a lista de eventos futuros (data, hora, título) para o
Supabase, junto com o resto do estado. O robô do GitHub Actions passou a
correr **a cada 15 minutos** (em vez de só nas 6 horas fixas das rotinas) e,
em cada execução, além de verificar as rotinas, olha também para os eventos
de hoje de cada dispositivo — se algum estiver a ±10 minutos da hora atual,
manda a notificação (ex: "11:00 — Estudar Mercado").

Como o robô corre em intervalos de 15 min com uma margem de ±10 min, num
caso raro (evento marcado muito perto da fronteira entre duas execuções)
podes receber a mesma notificação duas vezes seguidas. É um compromisso
aceite para manter isto simples — não há problema em ignorar o segundo
aviso.
