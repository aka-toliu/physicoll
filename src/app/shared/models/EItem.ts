export enum EFormat {
    DVD = 'DVD',
    BLURAY = 'BluRay',
    VHS = 'VHS'
}

export enum EDVDCase {
    AMARAY = 'Plástico (Amaray)',
    SLIMCASE = 'Plástico (Slim Case)',
    SLEEVE = 'Papelão Simples (Envelope/Sleeve)',
    STEELBOOK = 'Metal / Alumínio (Steelbook)',
    DIGIPACK = 'Papelão/Plástico (Digipak)',
    DIGIBOOK = 'Papelão Rígido (Digibook)',
    CUSTOM = 'Personalizada'
}

export enum EBluRayCase {
    AMARAY_BLUE = 'Plástico (Amaray Blue)',
    CRITERIOM = "Plástico Translúcido (Criterion Case)",
    CUSTOM = 'Personalizada'
}

export enum EVHSCase {
  CLAMSHELL = 'Plástico Flexível (Clamshell)',
  LIBRARY_CASE = 'Plástico Rígido (Library Case)',
  SLIPCOVER = 'Papel Cartão (Slipcase)',
  GATEFOLD = 'Papelão com Aba (Gatefold)'
}

export enum ECaseState {
    CASE_GREAT = 'Ótimo',
    CASE_GOOD = 'Bom',
    CASE_REGULAR = 'Regular',
    CASE_POOR = 'Ruim',
    CASE_TERRIBLE = 'Péssimo'
}

export enum EDiscState {
    DISC_GREAT = 'Ótimo',
    DISC_GOOD = 'Bom',
    DISC_REGULAR = 'Regular',
    DISC_POOR = 'Ruim',
    DISC_TERRIBLE = 'Péssimo'
}

export enum ETapeState {
    TAPE_GREAT = 'Ótimo',
    TAPE_GOOD = 'Bom',
    TAPE_REGULAR = 'Regular',
    TAPE_POOR = 'Ruim',
    TAPE_TERRIBLE = 'Péssimo'
}

export enum EStateDescription{
    CASE_GREAT = 'Sem marcas de uso ou com sinais mínimos e imperceptíveis que não afetam as informações impressas.',
    CASE_GOOD = 'Apresenta marcas leves de manuseio que não afetam as informações impressas.',
    CASE_REGULAR = 'Marcas de uso visíveis, mas com pouco comprometimento com as informações impressas.',
    CASE_POOR = 'Com danos visíveis que comprometem  as informações impressas.',
    CASE_TERRIBLE = 'Com danos severos que comprometem  as informações impressas e a funcionalidade.',
    DISC_GREAT = 'Sem marcas de uso ou com sinais mínimos e imperceptíveis, que não afetam a reprodução do conteúdo.',
    DISC_GOOD = 'Apresenta marcas leves de manuseio que não afetam a reprodução do conteúdo.',
    DISC_REGULAR = 'Marcas de uso visíveis, mas não afeta a reprodução do conteúdo.',  
    DISC_POOR = 'Danos visíveis que podem causar falhas ocasionais na reprodução do conteúdo.',
    DISC_TERRIBLE = 'Danos severos que comprometem a integridade física e a reprodução do conteúdo.',
    TAPE_GREAT = 'Carcaça plástica íntegra, sem mofo, poeira ou sinais de desgaste na fita magnética e não afetam a reprodução do conteúdo.',
    TAPE_GOOD = 'Apresenta marcas leves de uso na carcaça. Fita magnética limpa e com imagem estável, sem chuviscos ou ruídos sonoros.',
    TAPE_REGULAR = 'Marcas de uso visíveis na carcaça. Fita pode apresentar leves oscilações de imagem ou chuviscos eventuais, mas sem comprometer a exibição.',
    TAPE_POOR = 'Danos visíveis na carcaça ou sinais leves de mofo/poeira. Imagem com chuviscos frequentes, falhas no áudio ou distorções constantes que prejudicam a experiência.',
    TAPE_TERRIBLE = 'Carcaça quebrada ou fita magnética com danos severos (amassada, oxidada ou com mofo denso). Risco alto de danificar o player e reprodução do conteúdo muito comprometida.'
}

export enum EResolution {
    SD = 'SD',
    HD_720P = '720p',
    HD_1080P = '1080p',
    UHD_4K = '4k'
}