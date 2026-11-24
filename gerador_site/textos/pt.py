# -*- coding: utf-8 -*-
# TEXTOS EM PORTUGUÊS · Casa da Tapada
# Para mudar um texto do site, muda-o aqui e corre "python gerar.py".

T = {
    "html_lang": "pt-PT",
    "og_locale": "pt_PT",

    "nav": {
        "inicio": "Início", "casa": "A Casa", "regiao": "Região", "historia": "História", "reservar": "Reservar",
        "ligar": "Ligar", "abrir": "Abrir menu", "fechar": "Fechar menu",
        "aria_menu": "Menu principal", "aria_linguas": "Escolher língua",
    },
    "anterior": "Anterior", "seguinte": "Seguinte", "fechar": "Fechar",
    "em_breve": "em breve",
    "btn_airbnb": "Reservar no Airbnb",
    "wa_info": "Olá! Gostaria de saber a disponibilidade da Casa da Tapada.",
    "wa_reserva": ("Olá! Gostaria de reservar a Casa da Tapada.\n"
                   "Nome: \nData de check-in: \nData de check-out: \nNº de hóspedes: \n"
                   "Animais (sim/não): \nPedido especial: "),
    "email_assunto": "Pedido de reserva - Casa da Tapada",

    "meta": {
        "index": ("Casa da Tapada | Turismo rural na Atalaia do Campo, Fundão",
                  "Casa de campo com piscina privada na Atalaia do Campo, Fundão. Para casais e famílias até 6 pessoas. Reserve diretamente."),
        "casa": ("A Casa | Casa da Tapada",
                 "Dois quartos de casal, sala com lareira e sofá-cama, cozinha equipada, piscina privada e churrasqueira. Até 6 pessoas."),
        "regiao": ("Descubra a Região | Casa da Tapada",
                   "Castelo Novo, Monsanto, Serra da Gardunha, Serra da Estrela, festas e sabores da Beira Baixa."),
        "historia": ("A nossa história | Casa da Tapada",
                     "A história da Casa da Tapada: um antigo palheiro de família na Atalaia do Campo, transformado numa casa para receber hóspedes."),
        "reservar": ("Reservar | Casa da Tapada",
                     "Reserve diretamente a Casa da Tapada por WhatsApp ou email. Pedido de reserva, condições e regras da casa."),
        "legal": ("Informação Legal | Casa da Tapada",
                  "Identificação, termos e condições, privacidade, cookies e resolução de litígios da Casa da Tapada."),
    },

    "rodape": {
        "frase": "Casa de campo na Atalaia do Campo, Fundão. Tempo, silêncio e a sensação de estar em casa.",
        "navegar": "Navegar", "contactos": "Contactos",
        "livro": "Livro de Reclamações", "registo": "Alojamento Local n.º",
        "reclamacoes_email": "Reclamações também por email:",
        "termos": "Termos", "privacidade": "Privacidade", "cookies": "Cookies",
        "litigios": "Resolução de Litígios", "identificacao": "Identificação",
        "aria_barra": "Contacto rápido",
    },

    "alts": {
        "f1": "Sala com prateleiras decoradas e lareira", "f2": "Cesto de boas-vindas com produtos da região",
        "f3": "Mesa de jantar", "f4": "Prateleiras da zona de refeições", "f5": "Cozinha equipada",
        "f6": "Bancada da cozinha", "f7": "Sofá da sala", "f8": "Sala com lareira em pedra",
        "f13": "Casa de banho", "f14": "Pormenor do azulejo da casa de banho", "f15": "Casa de banho",
        "f20": "Serão junto à lareira exterior", "f22": "Lareira exterior", "f24": "Queijo, uvas e enchidos da região",
        "f25": "Entrada da Casa da Tapada", "f27": "Parede de pedra tradicional", "f28": "Passeio pelo olival",
        "f38": "Quarto de casal", "f44": "Entrada da casa", "f50": "Mesa posta no exterior",
        "f51": "Mesa exterior à sombra", "f54": "Refeição à sombra", "f59": "Quarto",
        "f62": "Rede entre as oliveiras", "f65": "Baloiço no olival", "f70": "Zona exterior com oliveira",
        "f71": "Piscina rodeada de oliveiras", "f72": "Piscina privada", "f73": "Espreguiçadeiras junto à piscina",
        "f75": "Quarto com candeeiro de cabeceira", "f76": "Quarto", "f77": "Quarto",
    },

    # ------------------------------------------------------------ INÍCIO
    "index": {
        "hero_frase": "Sinta-se em casa, no sossego do campo.",
        "btn_conhecer": "Conhecer a casa",
        "bv_sobre": "Bem-vindo",
        "bv_titulo": "Uma casa feita para abrandar",
        "bv_p1": "Na Casa da Tapada, os dias começam com o canto dos pássaros e terminam debaixo de um céu cheio de estrelas. Uma casa de campo cuidada ao pormenor, rodeada de oliveiras e árvores de fruto, pensada para casais, famílias e amigos que querem trocar a pressa da cidade por tempo de qualidade.",
        "bv_p2": "Aqui pode ler à sombra, mergulhar na piscina, acender a lareira e simplesmente estar. Nós tratamos do resto.",
        "bv_link": "Conhecer a nossa história",
        "destaques_aria": "O que a casa oferece",
        "destaques": [("Até 6", "hóspedes"), ("2 quartos", "de casal + sofá-cama"), ("Piscina", "privada"),
                      ("Lareira", "e ar condicionado"), ("Animais", "bem-vindos, com aviso")],
        "casa_sobre": "A casa", "casa_titulo": "Cada canto pensado para si",
        "casa_cartoes": [("sala", "f8", "Sala"), ("quartos", "f38", "Quartos"), ("cozinha", "f5", "Cozinha"), ("piscina", "f72", "Piscina")],
        "btn_ver_casa": "Ver a casa toda",
        "mom_sobre": "Momentos", "mom_titulo": "O que o espera na Tapada",
        "momentos": [
            ("f62", "Tardes à sombra", "Uma rede entre as oliveiras, um livro e mais nada para fazer."),
            ("f20", "Serões à lareira", "Noites calmas à volta da lareira exterior, com um copo de vinho da região."),
            ("f50", "Refeições ao ar livre", "Pequenos-almoços demorados e jantares longos à mesa, lá fora."),
            ("f28", "Fruta da árvore", "Na época certa, cerejas e pêssegos colhidos diretamente da árvore."),
        ],
        "aval_sobre": "Avaliações", "aval_titulo": "O que dizem os nossos hóspedes",
        "aval_nota": "Algumas avaliações foram traduzidas da língua original.",
        "aval_google": "5,0 · mais de 30 avaliações no Google",
        "avaliacoes": [
            ("Como disse a minha esposa, a palavra que descreve a casa na perfeição é 'casa', porque nos sentimos na verdade em casa!", "Ruben Adegas"),
            ("Casa muito bonita e tranquila, decorada com muito bom gosto! Sentimo-nos como em casa. As camas são de muito boa qualidade, tal como a roupa de cama e de banho! A Carla é muito simpática, prestável e, sobretudo, muito rápida a responder. Recomendo vivamente a CASA DA TAPADA, voltaremos com certeza.", "Celine Chorrier-Collet"),
            ("Aqui o tempo passa devagar. Acordar de manhã com o som dos passarinhos é mágico. À noite, contemplar o céu estrelado é lindo. A Casa da Tapada é CASA.", "Sílvia Alves"),
            ("Esta casinha tem tudo o que podíamos desejar para criar memórias em família. Muito acolhedora e cheia de detalhes que fazem toda a diferença!", "Alexandra Oliveira"),
            ("Casa extremamente acolhedora, cuidada ao detalhe e impecavelmente limpa. O espaço exterior é simplesmente um sonho!", "Tânia Pinto"),
            ("Fim de semana que soube a umas grandes férias. A casa é linda, acolhedora, com tudo o que precisamos.", "Adriana Almeida"),
            ("Um destino para criar recordações inesquecíveis a dois ou em família, e nem os pets ficam de fora!", "Laura Ribeiro"),
            ("Só o sossego e a tranquilidade deram para descansar da azáfama da cidade. Iremos voltar, e já estamos com saudades.", "Monica Emiliano"),
            ("Um lugar mágico. Tudo é perfeito, até o menor detalhe. Saímos com um nó na garganta porque foi maravilhoso.", "Sabrina Capdeville"),
        ],
        "rd_sobre": "Reserve diretamente",
        "rd_titulo": "Fale connosco, sem intermediários",
        "rd_texto": "Ao reservar diretamente, fica a ganhar: não há intermediários nem comissões de plataformas, e fala com a família que cuida da casa.",
        "rd_airbnb": "Prefere reservar pelo Airbnb? Também estamos lá.",
        "reg_sobre": "A região", "reg_titulo": "Descubra a Beira Baixa",
        "reg_texto": "A Casa da Tapada é o ponto de partida ideal para conhecer a natureza, as aldeias e as tradições da região.",
        "reg_cartoes": [
            ("descobrir", "Aldeias Históricas", "Castelo Novo, Monsanto e Alpedrinha, com as suas ruas de pedra e muita história."),
            ("descobrir", "Serras", "Trilhos e miradouros na Gardunha e, a um passeio de distância, a Serra da Estrela."),
            ("eventos", "Festas e sabores", "As festas de Santo António, a Feira do Enchido e do Presunto e a cereja do Fundão."),
        ],
        "reg_btn": "Descobrir a região",
        "tempo_sobre": "Meteorologia", "tempo_titulo": "O tempo na Atalaia do Campo",
        "tempo_texto": "Previsão para os próximos dias, para planear a sua estadia.",
        "tempo_label": "TEMPO",
        "cc_sobre": "Localização", "cc_titulo": "Como chegar",
        "cc_texto": "Abra o caminho no seu telemóvel e venha sem preocupações. O estacionamento é junto à casa.",
        "cc_mapa_titulo": "Mapa da localização da Casa da Tapada",
        "faq_sobre": "Dúvidas", "faq_titulo": "Perguntas frequentes",
        "faq": [
            ("Como faço uma reserva?", "Escolha as datas no calendário da página <a href=\"reservar.html\">Reservar</a> e envie-nos o pedido por WhatsApp ou email. Confirmamos a disponibilidade e o valor, e a reserva fica garantida com o pagamento de 50%."),
            ("Também posso reservar pelo Airbnb?", "Sim. A casa também está no <a href=\"{AIRBNB}\" target=\"_blank\" rel=\"noopener\">Airbnb</a>, onde a reserva e o pagamento seguem as condições da plataforma. Ao reservar diretamente connosco fica a ganhar, porque não há intermediários nem comissões."),
            ("Quantas pessoas pode receber a casa?", "Até 6 pessoas: dois quartos com cama de casal e um sofá-cama na sala."),
            ("Posso levar o meu animal de estimação?", "Sim, os animais são bem-vindos mediante acordo prévio."),
            ("Quais são os horários de check-in e check-out?", "Check-in a partir das 15h00 e check-out até às 11h00. Outros horários podem ser combinados, conforme a disponibilidade."),
            ("A piscina está disponível todo o ano?", "A piscina é privada e exclusiva dos hóspedes. A água não é aquecida, por isso a utilização depende do tempo e da vontade de cada um: não há uma época fixa."),
            ("A casa tem Wi-Fi e estacionamento?", "Sim. Há Wi-Fi na casa e estacionamento exterior junto à casa."),
            ("É adequada para crianças e bebés?", "Sim, crianças e bebés são bem-vindos. Temos cadeira de refeição para bebé, mas não temos berço. A piscina não tem vedação, por isso as crianças devem estar sempre acompanhadas por um adulto."),
            ("Pode-se fumar?", "Não é permitido fumar dentro de casa. No exterior pode fumar à vontade."),
        ],
    },

    # ------------------------------------------------------------ A CASA
    "casa": {
        "topo": {"sobre": "A casa", "titulo": "Cada canto pensado para si",
                 "texto": "Uma moradia de campo para até 6 pessoas, com piscina privada e espaço exterior, cuidada ao pormenor pela família."},
        "saltar_aria": "Espaços da casa",
        "divisoes": [
            ("quartos", "Quartos", "Dois quartos com cama de casal, em tons suaves, com roupa de cama e toalhas incluídas, para noites de descanso a sério."),
            ("sala", "Sala de estar", "Uma sala acolhedora, com lareira em pedra, ar condicionado e sofá-cama para mais dois hóspedes. O lugar para os serões frios e as conversas sem pressa."),
            ("cozinha", "Cozinha e zona de refeições", "Cozinha equipada e mesa de refeições em open space com a sala, para cozinhar e partilhar a mesa em família."),
            ("casa-de-banho", "Casa de banho", "Uma casa de banho luminosa, limpa e funcional, com azulejo tradicional."),
            ("piscina", "Piscina", "Piscina exterior privada, de utilização exclusiva dos hóspedes, com espreguiçadeiras e vista para o olival. A água não é aquecida."),
            ("exterior", "Churrasqueira e espaços exteriores", "Churrasqueira, mesa à sombra, lareira exterior, rede e baloiço entre as oliveiras: um espaço exterior pensado para aproveitar os dias longos e as noites quentes."),
        ],
        "comod_sobre": "Comodidades", "comod_titulo": "O que vai encontrar", "comod_titulo_curto": "Comodidades",
        "comodidades": [
            "Até 6 hóspedes", "2 quartos com cama de casal", "Sofá-cama na sala", "1 casa de banho",
            "Cozinha equipada", "Sala de estar e refeições em open space", "Lareira", "Ar condicionado",
            "Wi-Fi", "Roupa de cama e toalhas incluídas", "Piscina exterior privada", "Churrasqueira",
            "Espaço exterior de lazer", "Estacionamento junto à casa", "Animais bem-vindos, com acordo prévio",
            "Cesto de boas-vindas com produtos da região",
        ],
        "criancas_titulo": "Para quem viaja com crianças",
        "criancas": [
            "Crianças e bebés são bem-vindos.",
            "Temos cadeira de refeição para bebé.",
            "Não temos berço.",
            "A piscina não tem vedação de segurança: as crianças devem estar sempre acompanhadas por um adulto.",
        ],
        "faixa": {"titulo": "Gostou do que viu?", "texto": "Fale connosco e confirmamos a disponibilidade para as suas datas.", "botao": "Reservar"},
    },

    # ------------------------------------------------------------ REGIÃO
    "regiao": {
        "topo": {"sobre": "A região", "titulo": "Descubra a Região",
                 "texto": "Natureza, aldeias com história, sabores e tradições da Beira Baixa, a partir da Casa da Tapada."},
        "saltar_aria": "Secções da página",
        "saltar": [("descobrir", "Locais a visitar"), ("sabores", "Sabores"), ("experiencias", "Passeios"),
                   ("eventos", "Festas e eventos"), ("aldeia", "Na aldeia")],
        "locais_sobre": "Recomendamos", "locais_titulo": "Locais a visitar",
        "locais_texto": "A Casa da Tapada fica numa localização privilegiada para descobrir alguns dos lugares mais emblemáticos da Beira Baixa.",
        "ver_mapa": "Ver no mapa",
        "locais": [
            ("Castelo Novo", "Aldeia Histórica de Portugal",
             "Uma das mais bonitas Aldeias Históricas de Portugal, com ruas de pedra, castelo, património arquitetónico e paisagens sobre a Serra da Gardunha.",
             "Castelo Novo, Fundão"),
            ("Monsanto", "Aldeia Histórica de Portugal",
             "Uma das aldeias mais emblemáticas do país, famosa pelas enormes formações de granito e pelas casas construídas entre as rochas.",
             "Monsanto, Idanha-a-Nova"),
            ("Serra da Gardunha", "Natureza",
             "Perfeita para passeios na natureza, trilhos pedestres, miradouros e momentos de tranquilidade.",
             "Serra da Gardunha"),
            ("Serra da Estrela", "Natureza",
             "Paisagens de montanha, caminhadas e, no inverno, a neve. Um passeio imperdível para quem gosta de natureza.",
             "Serra da Estrela"),
            ("Alpedrinha", "Vila histórica",
             "Uma vila histórica com ruas tradicionais, património arquitetónico e o ambiente característico da Beira Baixa.",
             "Alpedrinha, Fundão"),
            ("Fundão", "Cidade",
             "Gastronomia regional, comércio tradicional, produtos locais e eventos culturais.",
             "Fundão, Portugal"),
            ("Praia Fluvial de Castelo Novo", "Para os dias quentes",
             "Uma excelente opção para aproveitar a natureza e refrescar-se nos meses mais quentes.",
             "Praia Fluvial de Castelo Novo"),
        ],
        "sabores_sobre": "Sabores", "sabores_titulo": "A mesa da Beira",
        "sabores_p": [
            "O Fundão é a terra da cereja. Na Tapada, na época certa, também há cerejas e pêssegos para colher diretamente da árvore.",
            "Queijos, enchidos, presunto, azeite e pão caseiro fazem parte da mesa beirã. Alguns chegam até si no cesto de boas-vindas.",
        ],
        "exp_sobre": "Passeios e experiências", "exp_titulo": "Conhecer a região com quem a conhece",
        "exp_texto": "A Alpreade Xplore organiza passeios turísticos pela nossa região, para conhecer paisagens, tradições e lugares especiais. Uma forma diferente de viver a sua estadia. Veja os passeios e atividades disponíveis no Instagram.",
        "exp_btn": "Ver no Instagram",
        "eventos_sobre": "Festas e tradições", "eventos_titulo": "Festas e eventos",
        "eventos_texto": "Uma boa oportunidade para conhecer as tradições locais e conviver com quem cá vive.",
        "eventos": [
            ("5 a 9 de agosto de 2027", "Festas em Honra de Santo António", "Uma das principais festividades da Atalaia do Campo, com tradição, convívio e animação, feita por pessoas para pessoas."),
            ("Maio / junho", "Feira do Enchido e do Presunto", "A feira da aldeia dedicada aos sabores da terra. As datas concretas são confirmadas todos os anos."),
            ("Junho", "Época da cereja", "O mês da cereja do Fundão, com festas e mercados dedicados a este fruto em várias localidades do concelho."),
        ],
        "aldeia_sobre": "Na aldeia", "aldeia_titulo": "Tudo o que precisa por perto",
        "aldeia_texto": "A Atalaia do Campo é uma aldeia pacata, com cafés e comércio local.",
        "servicos": [
            ("Cafés", ["Atalaia Spot", "Café Pelourinho", "Café Casa Velha"]),
            ("Mercearias e comércio", ["Mercado da Clarinha", "Minimercado Ganito", "Talho Torres"]),
        ],
        "aldeia_fundao": "Há também restaurantes na aldeia e nas localidades vizinhas. Para supermercados, farmácias e outros serviços, o Fundão fica a poucos minutos.",
        "faixa": {"titulo": "Venha descobrir a região", "texto": "A Casa da Tapada é o ponto de partida ideal.", "botao": "Reservar"},
    },

    # ------------------------------------------------------------ HISTÓRIA
    "historia": {
        "topo": {"sobre": "A nossa história", "titulo": "Uma casa de família",
                 "texto": "Muito antes de receber hóspedes, a Casa da Tapada já guardava as nossas memórias."},
        "capitulos": [
            ("As raízes", [
                "A minha ligação à Atalaia do Campo começou muito antes de existir a Casa da Tapada.",
                "Desde pequena que vinha à aldeia visitar os meus avós. Foi aqui que cresci entre histórias de família, natureza e a liberdade própria de quem tem raízes num lugar. Mesmo vivendo em Lisboa, a Atalaia esteve sempre presente na minha vida e foi sempre um lugar de regresso, de pertença e de memórias.",
            ], None),
            ("O antigo palheiro", [
                "Quando fui crescendo, os meus pais decidiram comprar uma quinta numa zona mais rural da aldeia, que outrora teria pertencido aos bisavós do meu pai. A família ia aumentando e a casa dos meus avós começou a tornar-se pequena para receber todos. Ao mesmo tempo, começámos a preferir o silêncio do campo ao movimento e ao barulho do centro da aldeia.",
                "Na quinta já existia um antigo palheiro, que os meus pais foram adaptando, aos poucos, às necessidades da nossa família. Não tinha grandes luxos nem todas as comodidades, mas tinha aquilo de que precisávamos para sair da rotina, estarmos juntos e aproveitarmos a tranquilidade do campo.",
                "Os meus filhos ainda viveram muitos momentos ali, numa altura em que as condições eram bastante simples. Para nós, isso nunca foi um problema. Pelo contrário, era precisamente essa simplicidade que nos permitia desligar, abrandar e aproveitar verdadeiramente os dias na aldeia. E sabia tão bem.",
                "Mais tarde, os meus filhos foram crescendo e os meus pais decidiram construir, na mesma quinta, uma casa maior — aquela onde hoje continuamos a ficar sempre que os visitamos, o que acontece com bastante regularidade, quase todos os fins de semana.",
                "Com a mudança para a casa nova, o antigo palheiro perdeu a função que tinha tido durante tantos anos e passou a servir sobretudo como arrecadação, onde os meus pais guardavam alguns dos produtos que recolhiam da terra.",
            ], "f27"),
            ("Uma nova vida", [
                "Com o passar do tempo, já na faculdade, a minha filha começou a levar consigo alguns amigos, rapazes e raparigas que se apaixonaram pela nossa aldeia desde o primeiro momento. Todos os anos regressavam para as festas e encontravam ali um lugar onde podiam estar juntos, longe da rotina e da agitação da cidade.",
                "Foi então que se tornou necessário dar uma nova vida àquela casa. Os meus pais fizeram-lhe uma pequena renovação e mobilaram-na com peças que tinham de outras casas. Sem grandes luxos ou preocupações estéticas, voltou a cumprir aquilo que sempre soube fazer tão bem: acolher pessoas, criar momentos felizes e guardar novas memórias.",
                "Em meados de 2025, alguém me sugeriu que transformasse aquela casa num alojamento local. Confesso que, numa primeira fase, não fiquei muito recetiva à ideia. Como nunca tinha sentido necessidade de procurar este tipo de refúgio, custava-me acreditar que outras pessoas pudessem procurar precisamente aquilo que, para mim, sempre tinha sido tão natural.",
                "Ainda assim, fui conversando com a família e, aos poucos, decidimos arriscar. Os meus pais confiaram em mim e deram-me a casa, permitindo-me dar-lhe um novo rumo e fazer dela aquilo que imaginasse.",
                "O meu marido e os meus filhos apoiaram-me desde o início, embora com algumas reservas e dúvidas sobre se o projeto iria realmente resultar. Talvez por isso, esta transformação tenha começado mais como uma experiência do que como uma certeza.",
            ], None),
            ("A zona exterior", [
                "Então começaram as obras. Quis aperfeiçoar a casa ao meu gosto, desde a pintura à decoração, cuidando de cada detalhe para que o espaço fosse acolhedor, bonito e tivesse verdadeiramente a nossa identidade. No final desse ano, a casa estava pronta.",
                "Ainda assim, para mim faltava qualquer coisa. A nossa região tem um clima tão agradável durante grande parte do ano que me parecia importante criar um espaço onde os hóspedes pudessem aproveitar também o exterior. Foi aí que surgiu a ideia da zona de lazer.",
                "Confesso que, nessa altura, a proposta não foi recebida com grande entusiasmo. A família receava que investíssemos demasiado num projeto que, caso não tivesse procura, pudesse acabar por ficar abandonado. Afinal, nós já tínhamos todas essas comodidades na quinta.",
                "Mas eu sentia que era diferente. Não queria apenas adaptar aquilo que já existia para nosso uso. Queria criar algo exclusivo para quem escolhesse ficar na Casa da Tapada — um espaço pensado para descansar, aproveitar os dias quentes, estar em família e viver a tranquilidade da quinta com privacidade.",
                "Deixámos passar os meses de janeiro e fevereiro e, em março, o meu marido decidiu acreditar comigo nesta ideia. Avançámos então com a criação da zona exterior e, em meados de abril, tudo estava finalmente concluído.",
            ], "f71"),
            ("Hoje", [
                "Foi aí que começou verdadeiramente esta aventura. Lançámos a página da Casa da Tapada no Instagram, já com todo o espaço pronto, e o que se seguiu foi um verdadeiro turbilhão de emoções. As pessoas começaram a seguir a página, a gostar do projeto, a pedir informações e a fazer reservas. A resposta superou todas as nossas expectativas.",
                "Até os mais reticentes acabaram por reconhecer que a persistência tinha valido a pena. Recebi muitos elogios pelo bom gosto, pela dedicação e por ter acreditado na ideia mesmo quando ainda existiam tantas dúvidas.",
                "Hoje, já não sou apenas eu a sonhar com este projeto. Somos uma equipa, uma família inteira a trabalhar para receber da melhor forma possível todas as pessoas que escolhem a Casa da Tapada.",
                "E é profundamente gratificante sentir o carinho de quem nos visita, receber mensagens bonitas, saber que gostaram da estadia e perceber que este espaço, que durante tantos anos guardou as nossas memórias, passou também a fazer parte das memórias de outras famílias.",
            ], None),
        ],
        "assinatura": "Esperamos por si na Casa da Tapada.",
        "assinatura_nome": "Carla e família",
        "valores": [
            ("O que nos inspira", "Família, tranquilidade, autenticidade, vida no campo e o prazer de receber bem."),
            ("A nossa missão", "Criar estadias simples, confortáveis e memoráveis, onde cada pessoa possa abrandar e sentir-se verdadeiramente em casa."),
            ("Como recebemos", "Com o mesmo cuidado com que recebemos quem chega à nossa casa."),
        ],
    },

    # ------------------------------------------------------------ RESERVAR
    "reservar": {
        "sobre": "Reservar", "titulo": "Reserve diretamente connosco",
        "texto": "Escolha as datas e envie-nos o pedido. Respondemos o mais rápido possível com a disponibilidade e o valor.",
        "btn_wa": "Pedir reserva por WhatsApp", "btn_email": "Enviar email",
        "nota_wa": "A mensagem do WhatsApp já abre com os campos para preencher.",
        "opcoes": {
            "aria": "Formas de reservar",
            "direto_selo": "Fica a ganhar", "direto_titulo": "Diretamente connosco",
            "direto_texto": "Sem intermediários nem comissões de plataformas. Escolha as datas no calendário e envie o pedido por WhatsApp ou email.",
            "direto_btn": "Escolher datas",
            "airbnb_titulo": "Pelo Airbnb",
            "airbnb_texto": "Também pode reservar pelo Airbnb. A reserva e o pagamento são feitos na plataforma, com as condições do Airbnb.",
        },
        "cal": {
            "titulo": "Datas da estadia", "texto": "Escolha a data de entrada e depois a de saída.",
            "indisponivel": "Indisponível", "selecionado": "Selecionado", "limpar": "Limpar datas",
            "anterior": "Mês anterior", "seguinte": "Mês seguinte",
            "nota": "A disponibilidade da reserva será confirmada pelo proprietário.",
            "checkin": "Check-in", "checkout": "Check-out", "escolher": "Escolher data",
            "hospedes": "Hóspedes", "animais": "Animais de estimação", "sim": "Sim", "nao": "Não",
            "nome": "Nome", "nome_ph": "O seu nome",
            "notas": "Notas (opcional)", "notas_ph": "Hora de chegada, pedidos especiais…",
            "noite": "noite", "noites": "noites",
            "preco_titulo": "Preço", "preco": "Sob consulta",
            "preco_texto": "Enviamos o valor para as datas escolhidas na resposta ao seu pedido. Não é cobrada taxa turística.",
            "aviso": "Escolha primeiro as datas de entrada e de saída no calendário.",
            "btn_wa": "Pedir reserva por WhatsApp", "btn_email": "Pedir por email",
            "msg": "Olá! Gostaria de reservar a Casa da Tapada.\nCheck-in: {in}\nCheck-out: {out} ({noites})\nHóspedes: {hospedes}\nAnimais: {animais}\nNome: {nome}\nNotas: {notas}",
            "assunto": "Pedido de reserva - Casa da Tapada",
        },
        "como_titulo": "Como funciona",
        "passos": [
            ("Escolha as datas", "Selecione as datas no calendário e envie o pedido por WhatsApp ou email."),
            ("Confirmamos", "Respondemos com a disponibilidade e o valor da estadia."),
            ("Reserva garantida", "A reserva fica confirmada com o pagamento de 50% do valor total."),
        ],
        "resumo_titulo": "Em resumo",
        "resumo": [("Check-in", "a partir das 15h00"), ("Check-out", "até às 11h00"), ("Capacidade", "até 6 pessoas"),
                   ("Animais", "com acordo prévio"), ("Caução", "150 €"), ("Pagamento", "MB WAY ou transferência")],
        "inclui_titulo": "A estadia inclui",
        "inclui": ["Cesto de boas-vindas com produtos da região", "Roupa de cama e toalhas de banho", "Wi-Fi",
                   "Estacionamento junto à casa", "Utilização exclusiva da piscina e do espaço exterior"],
        "cond_titulo": "Condições de reserva",
        "condicoes": [
            ("Pagamento e confirmação", [
                "A reserva é confirmada mediante o pagamento de 50% do valor total da estadia.",
                "Os restantes 50% e a caução são pagos até 7 dias antes do check-in.",
                "A falta de pagamento dentro do prazo implica o cancelamento automático da reserva.",
                "Aceitamos pagamento por MB WAY e transferência bancária.",
            ]),
            ("Cancelamento", [
                "Cancelamentos até 14 dias antes da entrada: é retido 50% do valor da reserva.",
                "Cancelamentos com menos de 14 dias de antecedência: o valor não é reembolsável.",
                "Em caso de não comparência (no-show), é devido o valor total da estadia.",
            ]),
            ("Caução", [
                "Caução de 150 €, paga juntamente com o valor restante da reserva.",
                "É devolvida após a verificação do estado do alojamento, até 3 dias após o check-out.",
            ]),
            ("Horários", [
                "Check-in a partir das 15h00 e check-out até às 11h00.",
                "Pedidos de horários diferentes podem ser considerados, conforme a disponibilidade.",
            ]),
            ("Regras da casa", [
                "Capacidade máxima de 6 hóspedes.",
                "Não é permitido fumar dentro de casa. É permitido fumar nas zonas exteriores.",
                "Animais de estimação permitidos mediante acordo prévio.",
                "Festas e eventos apenas com autorização prévia dos proprietários.",
                "Pedimos que respeite os equipamentos, o mobiliário e os espaços exteriores.",
            ]),
            ("Crianças e piscina", [
                "Crianças e bebés são bem-vindos. Temos cadeira de refeição para bebé, mas não temos berço.",
                "A piscina não é aquecida e não tem vedação de segurança: as crianças devem estar sempre acompanhadas por um adulto.",
            ]),
            ("Check-in e documentos", [
                "No check-in é pedido um documento de identificação de cada hóspede, para cumprimento das obrigações legais de registo de hóspedes.",
            ]),
        ],
        "cond_nota": "Ao reservar diretamente connosco, aceita estas condições e os <a href=\"legal.html#termos\">Termos e Condições</a>. Nas reservas pelo Airbnb, o pagamento e o cancelamento seguem as regras da plataforma.",
        "plataformas_titulo": "Prefere reservar pelo Airbnb?",
        "plataformas_texto": "A Casa da Tapada também está no Airbnb, onde a reserva e o pagamento seguem as condições da plataforma. Ao reservar diretamente connosco fica a ganhar: sem intermediários nem comissões.",
        "contactos_titulo": "Contactos", "telefone": "Telefone", "morada": "Morada",
    },

    # ------------------------------------------------------------ LEGAL
    "legal_html": """
        <section class="legal-pagina">
            <h1>Informação Legal</h1>
            <p class="legal-atualizado">Última atualização: novembro de 2026</p>

            <nav class="saltar saltar-legal" aria-label="Secções">
                <a href="#identificacao">Identificação</a>
                <a href="#termos">Termos e Condições</a>
                <a href="#privacidade">Privacidade</a>
                <a href="#cookies">Cookies</a>
                <a href="#litigios">Reclamações e Litígios</a>
            </nav>

            <article id="identificacao" class="legal-seccao">
                <h2>1. Identificação do alojamento</h2>
                <ul>
                    <li><strong>Nome do estabelecimento:</strong> Casa da Tapada</li>
                    <li><strong>Modalidade:</strong> Alojamento Local, moradia</li>
                    <li><strong>N.º de registo de Alojamento Local (RNAL):</strong> {RNAL}</li>
                    <li><strong>Titular / entidade exploradora:</strong> Leontino Costa Pinto</li>
                    <li><strong>NIF:</strong> 191 479 144</li>
                    <li><strong>Morada:</strong> Tapada, 6230-130 Atalaia do Campo, Fundão, Portugal</li>
                    <li><strong>Contactos:</strong> +351 927 539 498 · <a href="mailto:{EMAIL}">{EMAIL}</a></li>
                </ul>
            </article>

            <article id="termos" class="legal-seccao">
                <h2>2. Termos e Condições</h2>
                <p>Estes termos aplicam-se às reservas e estadias na Casa da Tapada. Ao confirmar uma reserva, o hóspede declara que leu e aceita estes termos e as condições publicadas na página <a href="reservar.html">Reservar</a> (pagamento, cancelamento, caução, horários e regras da casa), que fazem parte deste acordo.</p>
                <h3>Reserva e preço</h3>
                <p>O pedido de reserva pode ser feito por WhatsApp, telefone, email ou redes sociais. A reserva só é considerada confirmada após o pagamento indicado nas condições de reserva. O preço é comunicado em resposta a cada pedido, para a casa inteira, e inclui os impostos aplicáveis. Não é cobrada taxa turística municipal.</p>
                <h3>Obrigações do hóspede</h3>
                <p>O hóspede compromete-se a utilizar a casa e o seu recheio com cuidado, a respeitar o número máximo de pessoas acordado, as regras da casa e o descanso da vizinhança, e a apresentar no check-in um documento de identificação de cada hóspede, conforme exigido por lei.</p>
                <h3>Piscina e segurança</h3>
                <p>A piscina não tem vedação de segurança nem vigilância. A sua utilização é da responsabilidade dos hóspedes, e as crianças devem estar sempre acompanhadas por um adulto.</p>
                <h3>Responsabilidade</h3>
                <p>O hóspede é responsável pelos danos causados durante a estadia, podendo o respetivo valor ser descontado da caução. A Casa da Tapada não se responsabiliza por objetos pessoais deixados no alojamento nem por interrupções de serviços alheias à sua vontade (por exemplo, falhas de eletricidade, água ou internet da rede pública).</p>
                <h3>Alterações e língua</h3>
                <p>Estes termos podem ser atualizados. Aplica-se a cada reserva a versão em vigor na data em que foi confirmada. As versões noutras línguas são traduções; em caso de dúvida, prevalece a versão em português.</p>
            </article>

            <article id="privacidade" class="legal-seccao">
                <h2>3. Política de Privacidade</h2>
                <p>Respeitamos o Regulamento Geral sobre a Proteção de Dados (RGPD) e a legislação portuguesa aplicável.</p>
                <h3>Responsável pelo tratamento</h3>
                <p>Leontino Costa Pinto, titular da Casa da Tapada. Contacto para questões de privacidade: <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
                <h3>Que dados tratamos</h3>
                <p>Este site não tem formulários nem contas de utilizador e não recolhe dados pessoais diretamente. Tratamos apenas os dados que nos envia quando nos contacta ou reserva: nome, contactos, datas da estadia, número de hóspedes, pedidos especiais, dados de faturação (incluindo NIF, se pedir fatura) e os dados do documento de identificação pedidos no check-in.</p>
                <h3>Para que usamos e com que fundamento</h3>
                <ul>
                    <li>Responder a pedidos e gerir a reserva e a estadia (execução do contrato ou diligências pré-contratuais).</li>
                    <li>Emitir faturas e cumprir obrigações fiscais (obrigação legal).</li>
                    <li>Registo de hóspedes e comunicação obrigatória do alojamento de cidadãos estrangeiros às autoridades competentes (obrigação legal).</li>
                </ul>
                <h3>Com quem partilhamos</h3>
                <p>Apenas com quem a lei obriga (por exemplo, a Autoridade Tributária e as autoridades competentes pelo registo de hóspedes). As mensagens que nos envia passam pelos serviços que escolher usar (WhatsApp, Instagram, Facebook, email, Airbnb), que têm as suas próprias políticas de privacidade. Não vendemos nem cedemos dados para publicidade.</p>
                <h3>Durante quanto tempo</h3>
                <p>Guardamos os dados apenas durante o tempo necessário à reserva e à estadia e, depois, pelos prazos que a lei impõe (por exemplo, os documentos de faturação são guardados durante o prazo legal de conservação fiscal).</p>
                <h3>Os seus direitos</h3>
                <p>Pode pedir acesso, retificação, apagamento, limitação ou portabilidade dos seus dados, e opor-se ao seu tratamento, através do email acima. Tem também o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (<a href="https://www.cnpd.pt" target="_blank" rel="noopener">www.cnpd.pt</a>).</p>
            </article>

            <article id="cookies" class="legal-seccao">
                <h2>4. Política de Cookies</h2>
                <p>Este site não usa cookies próprios, nem ferramentas de estatística ou de publicidade.</p>
                <p>Algumas páginas carregam conteúdos de terceiros, que podem receber o seu endereço IP ou usar tecnologias semelhantes a cookies, segundo as suas próprias políticas:</p>
                <ul>
                    <li><strong>Google Fonts</strong> (tipos de letra), em todas as páginas.</li>
                    <li><strong>Google Maps</strong> (mapa de localização), na página inicial.</li>
                    <li><strong>weatherwidget.io</strong> (previsão do tempo), na página inicial.</li>
                </ul>
                <p>Pode bloquear ou apagar cookies nas definições do seu navegador. O site continua a funcionar normalmente.</p>
            </article>

            <article id="litigios" class="legal-seccao">
                <h2>5. Reclamações e Resolução de Litígios</h2>
                <p>Pode apresentar reclamação no <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener">Livro de Reclamações Eletrónico</a>, no livro de reclamações físico disponível no alojamento, ou por email para <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
                <p>Em caso de litígio de consumo, o consumidor pode recorrer a uma entidade de Resolução Alternativa de Litígios de consumo, como o CNIACC – Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (<a href="https://www.cniacc.pt" target="_blank" rel="noopener">www.cniacc.pt</a>). Mais informação no Portal do Consumidor (<a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener">www.consumidor.gov.pt</a>).</p>
            </article>
        </section>
""",
}
