/* Futa on Top - free posts + Vowbound helpers */
(function () {
  'use strict';

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + (iso.length <= 10 ? 'T00:00:00' : ''));
    if (isNaN(d.getTime())) return iso;
    try {
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return iso;
    }
  }

  function formatDuration(seconds) {
    var n = Number(seconds);
    if (!isFinite(n) || n <= 0) return '';
    var mins = Math.floor(n / 60);
    var secs = Math.round(n % 60);
    return mins ? mins + ':' + String(secs).padStart(2, '0') : secs + 's';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&' + 'amp;')
      .replace(/</g, '&' + 'lt;')
      .replace(/>/g, '&' + 'gt;')
      .replace(/"/g, '&' + 'quot;')
      .replace(/'/g, '&#39;');
  }


  var currentLang = 'en';
  var lastPostsData = null;
  var lastAnimationsData = null;

  var LANG = {
    en: {
      htmlLang: 'en',
      s: {
        'age.badge': '18+ Adult Content',
        'age.title': 'Are you 18 or older?',
        'age.text': 'Explicit futa games and art. Confirm you are an adult to enter.',
        'age.accept': "Yes - I'm 18+",
        'age.decline': 'No - Leave',
        'nav.games': 'Games',
        'nav.art': 'Art',
        'nav.throxxa': 'Throxxa',
        'nav.news': 'News',
        'nav.steam': 'Steam',
        'nav.patreon': 'Patreon',
        'intro.kicker': '18+ futa porn games & visual novels',
        'intro.title': 'Choose Your World',
        'intro.sub': 'Futa Heim is on Patreon | Futa on Top is on Steam [Free Demo]',
        'card.futaheim.badge': 'On Patreon',
        'card.futaheim.desc': '🌏 A realm of divine futa queens 👑 where conquered femboys birth hung futa heirs on their knees 🦠💦',
        'card.futaheim.play': 'Play Now',
        'card.fot.badge': 'Out on Steam | Free Demo',
        'card.fot.desc': '💕 A dystopian futa-dom visual novel ⚔️ where broken, desperate males worship futa code on their knees 🧬🔥',
        'card.fot.play': 'Play Free Demo',
        'card.fot.buy': 'Buy on Steam',
        'intro.peek.eyebrow': 'NSFW previews',
        'intro.peek.label': 'Peek below',
        'art.kicker': 'Art',
        'art.title': 'Latest Futaheim Animations',
        'art.emptyTitle': 'Latest animations',
        'art.emptyText': 'The animation feed could not be loaded here. Try again later or check Patreon for new previews.',
        'art.openPatreon': 'Open Patreon',
        'art.play': 'Play',
        'art.audio': 'Audio',
        'art.silent': 'Silent',
        'art.cardTitle': 'Futa Heim animation {n}',
        'art.tap': 'Tap Play to watch',
        'art.updated': 'Updated {date}',
        'vb.sub': 'Eternal Mating & Marriage Registry',
        'vb.live': 'Hunting - No Refusal',
        'vb.tab1': '01 The Bridecock',
        'vb.tab2': '02 Mating Protocol',
        'vb.reader': 'Scroll the details panel to read the full profile ↓',
        'vb.caption1': 'Veiled | Hard | Offering Nothing but Orders',
        'vb.caption2': "The ring is optional; the collar isn't.",
        'vb.title1': 'Mistress <em>Throxxa</em>',
        'vb.title2': 'Mating <em>Protocol</em>',
        'vb.tag1': 'Hot single futa in your area. Wedding-night predator. Your "no" is noise under her hips.',
        'vb.tag2': 'She does not negotiate. She seats cock and empties balls.',
        'vb.bodyRegistry': 'Body Registry',
        'vb.cockMetrics': 'Cock Metrics',
        'vb.domGraph': 'Dominance Graph',
        'vb.kink': 'Kink Coefficients (0–1 intensity · self-scored)',
        'vb.session': 'Session Mathematics',
        'vb.req': 'Applicant Requirements',
        'vb.words': 'Her Words · Unedited',
        'vb.btn.review': 'Submit Hole For Review',
        'vb.btn.book': 'Book Wedding-Night Session',
        'vb.btn.protocol': 'Mating Protocol',
        'vb.btn.bride': 'The Bridecock',
        'vb.btn.sign': 'Sign Mating Contract',
        'vb.btn.dowry': 'Offer Ass As Dowry',
        'vb.page': 'PAGE {page} / 02',
        'vb.origin': '#VX-THROXXA-69 | Mistress Throxxa | From Futa Heim',
        'vb.vow': 'Vowbound - "Til death, and then some."',
        'free.kicker': 'Free Patreon Posts Only',
        'free.title': 'Latest News',
        'free.public': 'Public post',
        'free.read': 'Read free post',
        'free.readAria': 'Read free post: {title}',
        'free.empty': 'No free posts cached yet.',
        'free.full': 'Full posts on Patreon',
        'free.all': 'All on Patreon',
        'free.why': 'Why Patreon?',
        'support.kicker': 'Support',
        'support.title': 'Patreon keeps the filth coming',
        'support.text': 'Steam is where you can play the demo and buy Futa on Top. Patreon is where Futa Heim chapters, extras, and uncensored cuts land first.',
        'support.b1': 'Latest chapter builds & downloads',
        'support.b2': 'Uncensored scenes and extras',
        'support.b3': 'WIP art, polls, NSFW animations',
        'support.join': 'Join Patreon',
        'support.path': 'Quick path',
        'support.pathTitle': 'Demo -> Steam -> Patreon',
        'support.pathText': 'Try the free demo. Grab Futa on Top on Steam. Support on Patreon for Futa Heim and extras.',
        'support.demo': 'Free Demo on Steam',
        'support.buy': 'Buy on Steam',
        'support.open': 'Open Patreon',
        'footer.text': 'Adult futa porn games and VNs. 18+ only. Steam | Patreon | Free public posts.',
        'footer.official': 'Official hub for Futa on Top, Futa Heim / Futaheim, and current updates people may search for on F95-style forums.',
        'footer.games': 'Games',
        'footer.support': 'Support',
        'footer.free': 'Free posts',
        'footer.note': '© Futa on Top | 18+ | All characters are adults'
      }
    },
    zh: {
      htmlLang: 'zh-CN',
      s: {
        'age.badge': '18+ 成人内容', 'age.title': '你已满 18 岁吗？', 'age.text': '本网站包含露骨成人游戏与美术。请确认你是成年人后进入。', 'age.accept': '是，我已满 18 岁', 'age.decline': '否，离开',
        'nav.games': '游戏', 'nav.art': '美术', 'nav.throxxa': 'Throxxa', 'nav.news': '新闻', 'nav.steam': 'Steam', 'nav.patreon': 'Patreon',
        'intro.kicker': '18+ 扶她成人色情游戏与视觉小说', 'intro.title': '选择你的世界', 'intro.sub': 'Futa Heim 在 Patreon | Futa on Top 在 Steam [免费试玩]',
        'card.futaheim.badge': 'Patreon 更新中', 'card.futaheim.desc': '🌏 神圣扶她女王统治的国度 👑 被征服的男娘跪地孕育强壮扶她继承人 🦠💦', 'card.futaheim.play': '立即游玩',
        'card.fot.badge': '已上架 Steam | 免费试玩', 'card.fot.desc': '💕 反乌托邦扶她支配视觉小说 ⚔️ 破碎而饥渴的男性跪拜扶她代码 🧬🔥', 'card.fot.play': '免费试玩', 'card.fot.buy': '在 Steam 购买',
        'intro.peek.eyebrow': 'NSFW 预览', 'intro.peek.label': '向下偷看',
        'art.kicker': '美术', 'art.title': 'Futa Heim 最新动画', 'art.emptyTitle': '最新动画', 'art.emptyText': '这里暂时无法载入动画流。请稍后重试，或到 Patreon 查看新预览。', 'art.openPatreon': '打开 Patreon', 'art.play': '播放', 'art.audio': '有声', 'art.silent': '静音', 'art.cardTitle': 'Futa Heim 动画 {n}', 'art.tap': '点击播放观看', 'art.updated': '更新于 {date}',
        'vb.sub': '永恒交配与婚姻登记', 'vb.live': '狩猎中 - 不接受拒绝', 'vb.tab1': '01 新娘巨根', 'vb.tab2': '02 交配协议', 'vb.reader': '滚动详情面板阅读完整档案 ↓', 'vb.caption1': '戴面纱 | 硬挺 | 只下命令', 'vb.caption2': '戒指可选；项圈不可少。', 'vb.title1': '女主人 <em>Throxxa</em>', 'vb.title2': '交配 <em>协议</em>', 'vb.tag1': '你附近的火辣单身扶她。新婚夜掠食者。你的“不”只是她胯下的噪音。', 'vb.tag2': '她不谈判。她坐入巨根，榨空双球。', 'vb.bodyRegistry': '身体登记', 'vb.cockMetrics': '阴茎指标', 'vb.domGraph': '支配图谱', 'vb.kink': '癖好系数（0–1 强度 · 自评分）', 'vb.session': '性爱数学', 'vb.req': '申请者要求', 'vb.words': '她的话 · 未删改', 'vb.btn.review': '提交洞口审核', 'vb.btn.book': '预订新婚夜场次', 'vb.btn.protocol': '交配协议', 'vb.btn.bride': '新娘巨根', 'vb.btn.sign': '签署交配契约', 'vb.btn.dowry': '献上屁股作嫁妆', 'vb.page': '第 {page} 页 / 02', 'vb.origin': '#VX-THROXXA-69 | Mistress Throxxa | 来自 Futa Heim', 'vb.vow': 'Vowbound - “至死，且不止。”',
        'free.kicker': 'Patreon 免费公开帖', 'free.title': '最新消息', 'free.public': '公开帖', 'free.read': '阅读免费帖', 'free.readAria': '阅读免费帖：{title}', 'free.empty': '还没有缓存的免费帖子。', 'free.full': '完整帖子在 Patreon', 'free.all': '全部 Patreon 帖子', 'free.why': '为什么 Patreon？',
        'support.kicker': '支持', 'support.title': 'Patreon 让污秽持续更新', 'support.text': 'Steam 可试玩并购买 Futa on Top。Patreon 会优先发布 Futa Heim 章节、额外内容和未删减版本。', 'support.b1': '最新章节构建与下载', 'support.b2': '未删减场景与额外内容', 'support.b3': '制作中美术、投票、NSFW 动画', 'support.join': '加入 Patreon', 'support.path': '快速路径', 'support.pathTitle': '试玩 -> Steam -> Patreon', 'support.pathText': '先玩免费试玩版。在 Steam 入手 Futa on Top。通过 Patreon 支持 Futa Heim 与额外内容。', 'support.demo': 'Steam 免费试玩', 'support.buy': '在 Steam 购买', 'support.open': '打开 Patreon',
        'footer.text': '成人扶她色情游戏与视觉小说。仅限 18+。Steam | Patreon | 免费公开帖。', 'footer.official': 'Futa on Top、Futa Heim 以及用户可能在 F95 类论坛搜索的最新官方更新入口。', 'footer.games': '游戏', 'footer.support': '支持', 'footer.free': '免费帖子', 'footer.note': '© Futa on Top | 18+ | 所有角色均为成年人'
      }
    },
    ru: {
      htmlLang: 'ru',
      s: {
        'age.badge': '18+ контент для взрослых', 'age.title': 'Вам уже есть 18?', 'age.text': 'На сайте есть откровенные футa-игры и арты. Подтвердите возраст, чтобы войти.', 'age.accept': 'Да, мне есть 18+', 'age.decline': 'Нет, уйти',
        'nav.games': 'Игры', 'nav.art': 'Арт', 'nav.throxxa': 'Throxxa', 'nav.news': 'Новости', 'nav.steam': 'Steam', 'nav.patreon': 'Patreon',
        'intro.kicker': '18+ футa-порноигры и визуальные новеллы', 'intro.title': 'Выбери свой мир', 'intro.sub': 'Futa Heim на Patreon | Futa on Top в Steam [бесплатное демо]',
        'card.futaheim.badge': 'На Patreon', 'card.futaheim.desc': '🌏 Царство божественных футa-королев 👑 где покорённые фембои на коленях рожают наследников 🦠💦', 'card.futaheim.play': 'Играть сейчас',
        'card.fot.badge': 'В Steam | Бесплатное демо', 'card.fot.desc': '💕 Дистопичная футa-дом визуальная новелла ⚔️ где сломленные мужчины поклоняются футa-коду на коленях 🧬🔥', 'card.fot.play': 'Играть в демо', 'card.fot.buy': 'Купить в Steam',
        'intro.peek.eyebrow': 'NSFW превью', 'intro.peek.label': 'Посмотри ниже',
        'art.kicker': 'Арт', 'art.title': 'Новые анимации Futa Heim', 'art.emptyTitle': 'Новые анимации', 'art.emptyText': 'Лента анимаций не загрузилась. Попробуйте позже или проверьте новые превью на Patreon.', 'art.openPatreon': 'Открыть Patreon', 'art.play': 'Play', 'art.audio': 'Звук', 'art.silent': 'Без звука', 'art.cardTitle': 'Анимация Futa Heim {n}', 'art.tap': 'Нажмите Play для просмотра', 'art.updated': 'Обновлено {date}',
        'vb.sub': 'Реестр вечной случки и брака', 'vb.live': 'Охота - отказ не принимается', 'vb.tab1': '01 Невеста с членом', 'vb.tab2': '02 Протокол случки', 'vb.reader': 'Прокрутите панель деталей, чтобы прочитать полный профиль ↓', 'vb.caption1': 'Фата | Твёрдый | Только приказы', 'vb.caption2': 'Кольцо по желанию; ошейник обязателен.', 'vb.title1': 'Госпожа <em>Throxxa</em>', 'vb.title2': 'Протокол <em>случки</em>', 'vb.tag1': 'Горячая одинокая футa рядом с тобой. Хищница брачной ночи. Твоё “нет” — шум под её бёдрами.', 'vb.tag2': 'Она не торгуется. Она насаживается членом и опустошает яйца.', 'vb.bodyRegistry': 'Реестр тела', 'vb.cockMetrics': 'Метрики члена', 'vb.domGraph': 'Граф доминирования', 'vb.kink': 'Коэффициенты кинков (0–1 · самооценка)', 'vb.session': 'Математика сессии', 'vb.req': 'Требования к кандидату', 'vb.words': 'Её слова · без правок', 'vb.btn.review': 'Отправить дырку на проверку', 'vb.btn.book': 'Забронировать брачную ночь', 'vb.btn.protocol': 'Протокол случки', 'vb.btn.bride': 'Невеста с членом', 'vb.btn.sign': 'Подписать контракт случки', 'vb.btn.dowry': 'Отдать зад как приданое', 'vb.page': 'СТРАНИЦА {page} / 02', 'vb.origin': '#VX-THROXXA-69 | Mistress Throxxa | из Futa Heim', 'vb.vow': 'Vowbound - «Пока смерть, и дальше».',
        'free.kicker': 'Бесплатные посты Patreon', 'free.title': 'Последние новости', 'free.public': 'Публичный пост', 'free.read': 'Читать бесплатный пост', 'free.readAria': 'Читать бесплатный пост: {title}', 'free.empty': 'Пока нет кешированных бесплатных постов.', 'free.full': 'Полные посты на Patreon', 'free.all': 'Все на Patreon', 'free.why': 'Почему Patreon?',
        'support.kicker': 'Поддержка', 'support.title': 'Patreon помогает выпускать больше грязи', 'support.text': 'В Steam можно сыграть в демо и купить Futa on Top. На Patreon первыми выходят главы Futa Heim, бонусы и нецензурные версии.', 'support.b1': 'Новые сборки глав и загрузки', 'support.b2': 'Нецензурные сцены и бонусы', 'support.b3': 'WIP-арт, опросы, NSFW-анимации', 'support.join': 'Поддержать на Patreon', 'support.path': 'Быстрый путь', 'support.pathTitle': 'Демо -> Steam -> Patreon', 'support.pathText': 'Попробуйте бесплатное демо. Купите Futa on Top в Steam. Поддержите Futa Heim и бонусы на Patreon.', 'support.demo': 'Бесплатное демо в Steam', 'support.buy': 'Купить в Steam', 'support.open': 'Открыть Patreon',
        'footer.text': 'Фута-порноигры и VN для взрослых. Только 18+. Steam | Patreon | бесплатные публичные посты.', 'footer.official': 'Официальный центр Futa on Top, Futa Heim и актуальных обновлений, которые могут искать на форумах вроде F95.', 'footer.games': 'Игры', 'footer.support': 'Поддержка', 'footer.free': 'Бесплатные посты', 'footer.note': '© Futa on Top | 18+ | Все персонажи совершеннолетние'
      }
    },
    fr: {
      htmlLang: 'fr',
      s: {
        'age.badge': 'Contenu adulte 18+', 'age.title': 'As-tu 18 ans ou plus ?', 'age.text': 'Jeux et art futa explicites. Confirme que tu es adulte pour entrer.', 'age.accept': "Oui - j'ai 18+", 'age.decline': 'Non - partir',
        'nav.games': 'Jeux', 'nav.art': 'Art', 'nav.throxxa': 'Throxxa', 'nav.news': 'News', 'nav.steam': 'Steam', 'nav.patreon': 'Patreon',
        'intro.kicker': 'Jeux porno futa et visual novels 18+', 'intro.title': 'Choisis ton monde', 'intro.sub': 'Futa Heim est sur Patreon | Futa on Top est sur Steam [démo gratuite]',
        'card.futaheim.badge': 'Sur Patreon', 'card.futaheim.desc': '🌏 Un royaume de reines futa divines 👑 où des femboys conquis donnent naissance à des héritiers futa à genoux 🦠💦', 'card.futaheim.play': 'Jouer maintenant',
        'card.fot.badge': 'Sur Steam | Démo gratuite', 'card.fot.desc': '💕 Un visual novel dystopique futa-dom ⚔️ où des mâles brisés adorent le code futa à genoux 🧬🔥', 'card.fot.play': 'Jouer à la démo', 'card.fot.buy': 'Acheter sur Steam',
        'intro.peek.eyebrow': 'Aperçus NSFW', 'intro.peek.label': 'Regarde plus bas',
        'art.kicker': 'Art', 'art.title': 'Dernières animations Futa Heim', 'art.emptyTitle': 'Dernières animations', 'art.emptyText': 'Le flux d’animations n’a pas pu être chargé ici. Réessaie plus tard ou consulte Patreon pour les nouveaux aperçus.', 'art.openPatreon': 'Ouvrir Patreon', 'art.play': 'Lire', 'art.audio': 'Audio', 'art.silent': 'Muet', 'art.cardTitle': 'Animation Futa Heim {n}', 'art.tap': 'Appuie sur Lire pour regarder', 'art.updated': 'Mis à jour le {date}',
        'vb.sub': 'Registre éternel de mariage et d’accouplement', 'vb.live': 'Chasse - aucun refus', 'vb.tab1': '01 La mariée à queue', 'vb.tab2': '02 Protocole d’accouplement', 'vb.reader': 'Fais défiler le panneau pour lire le profil complet ↓', 'vb.caption1': 'Voilée | Dure | N’offre que des ordres', 'vb.caption2': 'La bague est optionnelle ; le collier ne l’est pas.', 'vb.title1': 'Maîtresse <em>Throxxa</em>', 'vb.title2': 'Protocole <em>d’accouplement</em>', 'vb.tag1': 'Futa célibataire chaude près de chez toi. Prédatrice de nuit de noces. Ton “non” n’est qu’un bruit sous ses hanches.', 'vb.tag2': 'Elle ne négocie pas. Elle enfonce sa queue et vide ses couilles.', 'vb.bodyRegistry': 'Registre corporel', 'vb.cockMetrics': 'Mesures de queue', 'vb.domGraph': 'Graphe de dominance', 'vb.kink': 'Coefficients kink (intensité 0–1 · auto-noté)', 'vb.session': 'Mathématiques de session', 'vb.req': 'Exigences du candidat', 'vb.words': 'Ses mots · non édités', 'vb.btn.review': 'Soumettre ton trou à l’examen', 'vb.btn.book': 'Réserver la nuit de noces', 'vb.btn.protocol': 'Protocole d’accouplement', 'vb.btn.bride': 'La mariée à queue', 'vb.btn.sign': 'Signer le contrat d’accouplement', 'vb.btn.dowry': 'Offrir ton cul en dot', 'vb.page': 'PAGE {page} / 02', 'vb.origin': '#VX-THROXXA-69 | Mistress Throxxa | De Futa Heim', 'vb.vow': 'Vowbound - « Jusqu’à la mort, et après. »',
        'free.kicker': 'Posts Patreon publics gratuits', 'free.title': 'Dernières news', 'free.public': 'Post public', 'free.read': 'Lire le post gratuit', 'free.readAria': 'Lire le post gratuit : {title}', 'free.empty': 'Aucun post gratuit en cache pour le moment.', 'free.full': 'Posts complets sur Patreon', 'free.all': 'Tout sur Patreon', 'free.why': 'Pourquoi Patreon ?',
        'support.kicker': 'Soutien', 'support.title': 'Patreon garde la saleté en vie', 'support.text': 'Steam permet de jouer à la démo et d’acheter Futa on Top. Patreon reçoit d’abord les chapitres Futa Heim, les extras et les versions non censurées.', 'support.b1': 'Derniers builds de chapitres et téléchargements', 'support.b2': 'Scènes non censurées et extras', 'support.b3': 'Art WIP, sondages, animations NSFW', 'support.join': 'Rejoindre Patreon', 'support.path': 'Chemin rapide', 'support.pathTitle': 'Démo -> Steam -> Patreon', 'support.pathText': 'Essaie la démo gratuite. Prends Futa on Top sur Steam. Soutiens Futa Heim et les extras sur Patreon.', 'support.demo': 'Démo gratuite sur Steam', 'support.buy': 'Acheter sur Steam', 'support.open': 'Ouvrir Patreon',
        'footer.text': 'Jeux porno futa et VNs adultes. 18+ seulement. Steam | Patreon | posts publics gratuits.', 'footer.official': 'Hub officiel pour Futa on Top, Futa Heim et les mises à jour que certains cherchent sur des forums de type F95.', 'footer.games': 'Jeux', 'footer.support': 'Soutien', 'footer.free': 'Posts gratuits', 'footer.note': '© Futa on Top | 18+ | Tous les personnages sont adultes'
      }
    }
  };

  function t(key, vars) {
    var dict = (LANG[currentLang] && LANG[currentLang].s) || LANG.en.s;
    var text = dict[key] || LANG.en.s[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        text = text.replace(new RegExp('\\{' + name + '\\}', 'g'), vars[name]);
      });
    }
    return text;
  }

  var I18N_BINDINGS = [
    ['#age-modal .age-modal__badge', 'age.badge'], ['#age-title', 'age.title'], ['#age-modal p', 'age.text'], ['#age-accept', 'age.accept'], ['#age-decline', 'age.decline'],
    ['#header a[href="#intro"].nav-hide-md', 'nav.games'], ['#header a[href="#work"].nav-hide-md', 'nav.art'], ['#header a[href="#throxxa"]', 'nav.throxxa'], ['#header a[href="#free"]', 'nav.news'], ['#header .is-cta-steam .nav-text', 'nav.steam'], ['#header .is-cta .nav-text', 'nav.patreon'],
    ['#intro .intro-header .fot-kicker', 'intro.kicker'], ['#intro .intro-header h2', 'intro.title'], ['#intro .intro-sub', 'intro.sub'],
    ['#game-futaheim .game-card__badge', 'card.futaheim.badge'], ['#game-futaheim .game-card__desc', 'card.futaheim.desc'], ['#game-futaheim .btn-play', 'card.futaheim.play'],
    ['#game-futa-on-top .game-card__badge', 'card.fot.badge'], ['#game-futa-on-top .game-card__desc', 'card.fot.desc'], ['#game-futa-on-top .btn-play', 'card.fot.play'], ['#game-futa-on-top .btn-steam span', 'card.fot.buy'],
    ['.intro-tease__eyebrow', 'intro.peek.eyebrow'], ['.intro-tease__label', 'intro.peek.label'],
    ['#work .section-head .fot-kicker', 'art.kicker'], ['#work .section-head h2', 'art.title'],
    ['.vb-sub', 'vb.sub'], ['.vb-live', 'vb.live'], ['.vb-tabs [data-vb-page="1"]', 'vb.tab1'], ['.vb-tabs [data-vb-page="2"]', 'vb.tab2'], ['.vb-reader-hint', 'vb.reader'], ['#vb-page-1 .vb-shot figcaption', 'vb.caption1'], ['#vb-page-2 .vb-shot figcaption', 'vb.caption2'],
    ['#vb-page-1 .vb-title', 'vb.title1', true], ['#vb-page-2 .vb-title', 'vb.title2', true], ['#vb-page-1 .vb-tagline', 'vb.tag1'], ['#vb-page-2 .vb-tagline', 'vb.tag2'],
    ['#vb-page-1 .vb-card:nth-of-type(1) .vb-h', 'vb.bodyRegistry'], ['#vb-page-1 .vb-card:nth-of-type(2) .vb-h', 'vb.cockMetrics'], ['#vb-page-2 .vb-card--dom .vb-h', 'vb.domGraph'], ['#vb-page-2 .vb-pair:first-child .vb-card:nth-child(2) .vb-h', 'vb.kink'], ['#vb-page-2 .vb-main > .vb-card .vb-h', 'vb.session'], ['#vb-page-2 .vb-pair:last-child .vb-card:nth-child(1) .vb-h', 'vb.req'], ['#vb-page-2 .vb-pair:last-child .vb-card:nth-child(2) .vb-h', 'vb.words'],
    ['#vb-page-1 .vb-btn--patreon', 'vb.btn.review'], ['#vb-page-1 .vb-btn--steam', 'vb.btn.book'], ['#vb-page-1 .vb-btn--gold', 'vb.btn.protocol'], ['#vb-page-2 .vb-btn--ghost', 'vb.btn.bride'], ['#vb-page-2 .vb-btn--discord', 'vb.btn.sign'], ['#vb-page-2 .vb-btn--patreon', 'vb.btn.dowry'], ['.vb-foot span:nth-child(2)', 'vb.origin'], ['.vb-foot span:nth-child(3)', 'vb.vow'],
    ['#free .section-head .fot-kicker', 'free.kicker'], ['#free .fot-title', 'free.title'], ['#free .fot-btn--patreon', 'free.all'], ['#free .fot-btn--ghost', 'free.why'],
    ['#support .fot-kicker', 'support.kicker'], ['#support h2', 'support.title'], ['#support .patreon-copy > p:not(.fot-kicker)', 'support.text'], ['#support .benefit-list li:nth-child(1)', 'support.b1'], ['#support .benefit-list li:nth-child(2)', 'support.b2'], ['#support .benefit-list li:nth-child(3)', 'support.b3'], ['#support .patreon-copy .fot-btn--patreon', 'support.join'], ['#support .price-hint', 'support.path'], ['#support .patreon-card h3', 'support.pathTitle'], ['#support .patreon-card p:not(.price-hint)', 'support.pathText'], ['#support .fot-btn--play', 'support.demo'], ['#support .patreon-card .fot-btn--steam', 'support.buy'], ['#support .patreon-card .fot-btn--patreon', 'support.open'],
    ['#footer .footer-brand p:not(.footer-official)', 'footer.text'], ['#footer .footer-official', 'footer.official'], ['#footer .footer-col:nth-child(2) h4', 'footer.games'], ['#footer .footer-col:nth-child(3) h4', 'footer.support'], ['#footer a[href="#free"]', 'footer.free'], ['#footer .footer-note', 'footer.note']
  ];



  var VOWBOUND_TRANSLATIONS = {
  "en": {
    "p1.chip1": "The Wombmauler",
    "p1.chip2": "Futa Domme",
    "p1.chip3": "Verified Cock",
    "p1.chip4": "Open to Eternal Bond",
    "p1.chip5": "Breeder",
    "p1.chip6": "Masochist Top",
    "p1.chip7": "No Safeword",
    "p2.chip1": "Non-Con",
    "p2.chip2": "Orgasm Control",
    "p2.chip3": "Pain / Power",
    "p2.chip4": "Anal",
    "p2.chip5": "Creampie Seal",
    "p2.chip6": "VowPlay",
    "p1.bio": "<strong>Mistress Throxxa</strong> doesn’t date — she <strong>claims breeding stock</strong>. Six-foot five of elf muscle under a white veil: freckled cheeks, gold-and-green prey-lock stare, balls heavy enough to make the mattress dip. That <strong>11 inch flared cock</strong> is already drooling. She dresses like forever-wife so she can split you open on the wedding night and keep thrusting until your hole screams <strong>Bull-Bride</strong>. Vampire-mutated shapeshifter — she <strong>swells inside you mid-thrust when you struggle</strong>, thicker still if your whimpering amuses her. She wants a throat, a cunt, an ass, and a last name — not necessarily in that order.",
    "r1.dt1": "Race",
    "r1.dd1": "Elf · Vampire strain · <b>+34%</b> thrust power when blood is in the air",
    "r1.dt2": "Anomaly",
    "r1.dd2": "Shapeshifter · Phallic girth scalable <b>1.0× → 1.45×</b>",
    "r1.dt3": "Height",
    "r1.dd3": "<b>6′5″</b> / <b>195.6 cm</b>",
    "r1.dt4": "Build",
    "r1.dd4": "Mesomorph-dominant · Visible six-pack · Can bench-press you mid-mount",
    "r1.dt5": "Mass Class",
    "r1.dd5": "Combat-dense · Estimated <b>≈ 92–98 kg</b> lean-heavy",
    "r1.dt6": "Eyes",
    "r1.dd6": "Heterochromia · OD gold / OS green · Prey-lock trained",
    "r1.dt7": "Hair",
    "r1.dd7": "Long Platinum waves · Usable as a fist-leash",
    "r1.dt8": "Skin",
    "r1.dd8": "Fair, freckled · Marks easily · Bruise retention",
    "r1.dt9": "Bust",
    "r1.dd9": "Massive · Nipple erectile response &lt; <b>2 s</b> to pain/pleasure stimulus",
    "r1.dt10": "Look",
    "r1.dd10": "Silver bridal lace · Collar · Tiara + veil = psychological ownership cue",
    "c1.dt1": "Erect Length",
    "c1.dd1": "<b>&gt; 11.0 in</b> / <b>&gt; 27.9 cm</b> bone-press · Tip-to-pubic measured hard",
    "c1.dt2": "Midshaft Girth",
    "c1.dd2": "Circumference <b>≈ 6.4–6.8 in</b> · diameter <b>≈ 2.0–2.2 in</b> · “Jaw failure” threshold for untrained mouths",
    "c1.dt3": "Head / Flare",
    "c1.dd3": "Blunt crown · High coronal ridge · Pull-out resistance coefficient rated <b>High</b> on swollen sphincter",
    "c1.dt4": "Testicular Load",
    "c1.dd4": "Low-hanging · Overfull · Slap mass sufficient to redden thighs at <b>≥ 1.2 Hz</b> thrust cadence",
    "c1.dt5": "Ejaculate Volume",
    "c1.dd5": "Primary load <b>28–40 mL</b> · Stacked orgasms can total <b>&gt; 90 mL</b> / session · viscosity high (womb-coat / colon-paint)",
    "c1.dt6": "Shot Count",
    "c1.dd6": "<b>4–7</b> full ejaculations before refractory collapse · Vampire mutation shortens downtime to <b>≈ 3–6 min</b>",
    "c1.dt7": "Penetration Force",
    "c1.dd7": "Initial entry pressure tuned for tight holes · Once past the ring she <strong>does not ask</strong>, she seats to the hilt and holds",
    "c1.dt8": "Shapeshift Δ",
    "c1.dd8": "Knot-analogue swell <b>+15–45%</b> base girth for lock-in mating · Non-reversible with safeword",
    "c1.dt9": "Breeding Index",
    "c1.dd9": "Fertility flag: <b>ACTIVE</b> · creampie depth priority: cervical / prostate battering until overflow leaks past the shaft",
    "meter1": "Breeding compulsion / Creampie lock",
    "meter2": "Top / penetrative control",
    "meter3": "Marriage permanence intent",
    "meter4": "Psychological ownership drive",
    "meter5": "Aftercare (earned, not free)",
    "kink1": "Anal — no condoms",
    "kink2": "Struggle-fuck",
    "kink3": "Facefucking / throat claim",
    "kink4": "Sizeplay via shapeshift",
    "kink5": "Partner chastity",
    "s.dt1": "Mount Order",
    "s.dd1": "Mouth warm-up <b>3–8 min</b> → primary hole seating → grind lock <b>≥ 20 strokes</b> deep before first unload",
    "s.dt2": "Anal Target",
    "s.dd2": "First-session stretch goal: full midshaft acceptance · failure mode = held open on her tongue until compliant",
    "s.dt3": "Thrust Cadence",
    "s.dd3": "Idle grind <b>0.6–0.9 Hz</b> · punishing peak <b>1.4–1.8 Hz</b> · hip-check against cervix/prostate every 4th stroke",
    "s.dt4": "Load Placement",
    "s.dd4": "Priority queue: <b>(1)</b> womb/ass deepest point · <b>(2)</b> throat mark · <b>(3)</b> tits/veil desecration for photos",
    "s.dt5": "Leak Rule",
    "s.dd5": "Overflow down the thighs is proof of work · wiping without permission = insolence",
    "s.dt6": "Marriage Clause",
    "s.dd6": "Applicants may be bound as spouse, seed-dump, or both · ring finger and asshole ranked equal contracts",
    "rule1": "<strong>Breeding compliance</strong> — creampies stay put. Hands off. Clench and thank her.",
    "rule2": "<strong>Verbal surrender</strong> — <em>Bull-Mistress</em>, <em>She-King</em>, <em>Don't stop</em>. Gagging counts as punctuation. Tears are lube.",
    "rule3": "<strong>Body for furniture</strong> — 6′5″ of muscle will pin you, fold you, bench you. No safeword. No stop. Struggle triggers swell.",
    "quote": "I wore the veil so you’d understand the contract: tonight you marry my cock. Scratch me. Bite me. Make it hurt while I breed you — I want my orgasm filthy and bright with pain. Then you hold still with my cum packing your hole like a wedding seal. Call me Mistress when you choke. Call me your wife when you can’t walk. If you’re still empty by morning, you failed the interview."
  },
  "zh": {
    "p1.chip1": "子宫碾碎者",
    "p1.chip2": "扶她女主人",
    "p1.chip3": "认证巨根",
    "p1.chip4": "接受永恒绑定",
    "p1.chip5": "播种者",
    "p1.chip6": "受虐型上位者",
    "p1.chip7": "无安全词",
    "p2.chip1": "非自愿",
    "p2.chip2": "高潮控制",
    "p2.chip3": "疼痛 / 权力",
    "p2.chip4": "肛交",
    "p2.chip5": "内射封印",
    "p2.chip6": "誓约玩法",
    "p1.bio": "<strong>女主人 Throxxa</strong> 不约会——她会 <strong>占有繁殖种畜</strong>。六英尺五的精灵肌肉藏在白色头纱下：雀斑脸颊，金绿异色的猎物锁定眼神，沉重到让床垫下陷的睾丸。那根 <strong>11 英寸外扩龟头的肉棒</strong> 已经在滴液。她打扮得像永远的妻子，好在新婚夜把你劈开，并持续抽插，直到你的洞尖叫着承认自己是 <strong>公牛新娘</strong>。吸血鬼突变的变形者——当你挣扎时，她会 <strong>在你体内边插边膨胀</strong>；如果你的呜咽取悦她，还会变得更粗。她想要一张喉咙、一个小穴、一个屁股，以及一个姓氏——顺序不一定。",
    "r1.dt1": "种族",
    "r1.dd1": "精灵 · 吸血鬼血脉 · 血腥气息存在时抽插力量 <b>+34%</b>",
    "r1.dt2": "异常",
    "r1.dd2": "变形者 · 阴茎围度可扩展 <b>1.0× → 1.45×</b>",
    "r1.dt3": "身高",
    "r1.dd3": "<b>6′5″</b> / <b>195.6 cm</b>",
    "r1.dt4": "体型",
    "r1.dd4": "中胚型优势 · 清晰六块腹肌 · 能在骑乘中把你卧推起来",
    "r1.dt5": "质量级别",
    "r1.dd5": "战斗密度 · 估计 <b>≈ 92–98 kg</b> 精瘦偏重",
    "r1.dt6": "眼睛",
    "r1.dd6": "异色瞳 · 右眼金色 / 左眼绿色 · 训练过猎物锁定",
    "r1.dt7": "头发",
    "r1.dd7": "长铂金色波浪发 · 可当拳头牵引绳使用",
    "r1.dt8": "皮肤",
    "r1.dd8": "白皙、有雀斑 · 容易留下痕迹 · 淤痕保留",
    "r1.dt9": "胸部",
    "r1.dd9": "巨大 · 乳头对疼痛/快感刺激的勃起反应 &lt; <b>2 秒</b>",
    "r1.dt10": "外观",
    "r1.dd10": "银色新娘蕾丝 · 项圈 · 王冠 + 头纱 = 心理占有提示",
    "c1.dt1": "勃起长度",
    "c1.dd1": "<b>&gt; 11.0 英寸</b> / <b>&gt; 27.9 cm</b> 骨压测量 · 从龟头到耻骨硬度测量",
    "c1.dt2": "中段围度",
    "c1.dd2": "周长 <b>≈ 6.4–6.8 英寸</b> · 直径 <b>≈ 2.0–2.2 英寸</b> · 对未经训练的嘴来说达到“下颌失效”阈值",
    "c1.dt3": "龟头 / 外扩",
    "c1.dd3": "钝圆冠部 · 高冠状沟 · 对肿胀括约肌的拔出阻力系数评级为 <b>高</b>",
    "c1.dt4": "睾丸载量",
    "c1.dd4": "低垂 · 过满 · 以 <b>≥ 1.2 Hz</b> 抽插节奏拍打时，质量足以把大腿拍红",
    "c1.dt5": "射精量",
    "c1.dd5": "主射量 <b>28–40 mL</b> · 连续高潮每场可累计 <b>&gt; 90 mL</b> · 黏度高（子宫涂层 / 结肠涂漆）",
    "c1.dt6": "射精次数",
    "c1.dd6": "不应期崩溃前可完整射精 <b>4–7</b> 次 · 吸血鬼突变将恢复时间缩短至 <b>≈ 3–6 分钟</b>",
    "c1.dt7": "插入力",
    "c1.dd7": "初入压力专为紧洞调校 · 一旦越过肉环，她 <strong>不会询问</strong>，会坐到底并按住",
    "c1.dt8": "变形 Δ",
    "c1.dd8": "类似结节的膨胀使根部围度增加 <b>+15–45%</b>，用于锁定交配 · 使用安全词也不可逆",
    "c1.dt9": "繁殖指数",
    "c1.dd9": "生育标记：<b>激活</b> · 内射深度优先：猛撞宫颈 / 前列腺，直到精液从肉棒旁溢出",
    "meter1": "繁殖冲动 / 内射锁定",
    "meter2": "上位 / 插入控制",
    "meter3": "婚姻永久意图",
    "meter4": "心理占有驱动",
    "meter5": "事后照料（必须赢得，不免费）",
    "kink1": "肛交 — 不戴套",
    "kink2": "挣扎性交",
    "kink3": "操脸 / 喉咙占有",
    "kink4": "通过变形进行尺寸玩法",
    "kink5": "伴侣贞操控制",
    "s.dt1": "骑乘顺序",
    "s.dd1": "口交预热 <b>3–8 分钟</b> → 主洞入座 → 首次卸载前深磨锁定 <b>≥ 20 下</b>",
    "s.dt2": "肛门目标",
    "s.dd2": "第一次场次拉伸目标：完整接受中段 · 失败模式 = 被她用舌头撑开直到顺从",
    "s.dt3": "抽插节奏",
    "s.dd3": "待机研磨 <b>0.6–0.9 Hz</b> · 惩罚峰值 <b>1.4–1.8 Hz</b> · 每第 4 下用髋部撞击宫颈/前列腺",
    "s.dt4": "精液投放",
    "s.dd4": "优先队列：<b>(1)</b> 子宫/屁股最深处 · <b>(2)</b> 喉咙标记 · <b>(3)</b> 乳房/头纱亵渎照",
    "s.dt5": "泄漏规则",
    "s.dd5": "精液从大腿流下是完成工作的证明 · 未经允许擦掉 = 忤逆",
    "s.dt6": "婚姻条款",
    "s.dd6": "申请者可被绑定为配偶、精液垃圾桶，或两者兼具 · 无名指和肛门被列为同等合同",
    "rule1": "<strong>繁殖服从</strong> — 内射必须留在体内。手拿开。夹紧并感谢她。",
    "rule2": "<strong>语言投降</strong> — <em>公牛女主人</em>、<em>女王</em>、<em>不要停</em>。呛咳算标点。眼泪是润滑剂。",
    "rule3": "<strong>身体当家具</strong> — 6′5″ 的肌肉会压住你、折叠你、把你卧推起来。无安全词。不能停。挣扎会触发膨胀。",
    "quote": "我戴上头纱，是为了让你明白这份契约：今晚你要嫁给我的肉棒。抓我。咬我。让我在繁殖你时感到疼——我要我的高潮肮脏，并因疼痛而明亮。然后你要一动不动，让我的精液像婚礼封印一样塞满你的洞。你呛住时叫我女主人。你走不了路时叫我妻子。如果到早上你还空着，那就是你面试失败。"
  },
  "ru": {
    "p1.chip1": "Разрывательница утроб",
    "p1.chip2": "Фута-домина",
    "p1.chip3": "Проверенный член",
    "p1.chip4": "Открыта вечной связи",
    "p1.chip5": "Осеменительница",
    "p1.chip6": "Мазохистичный топ",
    "p1.chip7": "Без стоп-слова",
    "p2.chip1": "Без согласия",
    "p2.chip2": "Контроль оргазма",
    "p2.chip3": "Боль / власть",
    "p2.chip4": "Анал",
    "p2.chip5": "Печать кремпая",
    "p2.chip6": "Игра клятвы",
    "p1.bio": "<strong>Госпожа Throxxa</strong> не ходит на свидания — она <strong>забирает племенной скот</strong>. Шесть футов пять дюймов эльфийских мышц под белой фатой: веснушчатые щёки, золотисто-зелёный взгляд, фиксирующий добычу, и яйца настолько тяжёлые, что матрас проседает. Этот <strong>11-дюймовый член с расширенной головкой</strong> уже течёт. Она одевается как вечная жена, чтобы разорвать тебя в брачную ночь и продолжать трахать, пока твоя дырка не завизжит <strong>Невеста Быка</strong>. Вампирская мутировавшая оборотница — она <strong>разбухает внутри тебя прямо во время толчков, когда ты сопротивляешься</strong>, и становится ещё толще, если твоё хныканье её забавляет. Ей нужны горло, пизда, задница и фамилия — не обязательно в этом порядке.",
    "r1.dt1": "Раса",
    "r1.dd1": "Эльф · вампирский штамм · <b>+34%</b> силы толчков, когда в воздухе запах крови",
    "r1.dt2": "Аномалия",
    "r1.dd2": "Оборотница · фаллическая толщина масштабируется <b>1.0× → 1.45×</b>",
    "r1.dt3": "Рост",
    "r1.dd3": "<b>6′5″</b> / <b>195.6 см</b>",
    "r1.dt4": "Телосложение",
    "r1.dd4": "Мезоморф-доминант · видимый пресс · может жать тебя лёжа прямо во время езды сверху",
    "r1.dt5": "Массовый класс",
    "r1.dd5": "Боевая плотность · оценочно <b>≈ 92–98 кг</b>, сухая тяжесть",
    "r1.dt6": "Глаза",
    "r1.dd6": "Гетерохромия · правый золотой / левый зелёный · взгляд обучен фиксировать добычу",
    "r1.dt7": "Волосы",
    "r1.dd7": "Длинные платиновые волны · пригодны как поводок для кулака",
    "r1.dt8": "Кожа",
    "r1.dd8": "Светлая, веснушчатая · легко помечается · удерживает синяки",
    "r1.dt9": "Грудь",
    "r1.dd9": "Огромная · эрекция сосков на боль/удовольствие &lt; <b>2 с</b>",
    "r1.dt10": "Образ",
    "r1.dd10": "Серебряное свадебное кружево · ошейник · тиара + фата = психологический сигнал владения",
    "c1.dt1": "Длина в эрекции",
    "c1.dd1": "<b>&gt; 11.0 дюйма</b> / <b>&gt; 27.9 см</b> с прижимом к кости · измерено твёрдым от кончика до лобка",
    "c1.dt2": "Толщина середины",
    "c1.dd2": "Окружность <b>≈ 6.4–6.8 дюйма</b> · диаметр <b>≈ 2.0–2.2 дюйма</b> · порог “отказа челюсти” для нетренированных ртов",
    "c1.dt3": "Головка / расширение",
    "c1.dd3": "Тупая корона · высокий венечный край · коэффициент сопротивления вытаскиванию оценён как <b>Высокий</b> на распухшем сфинктере",
    "c1.dt4": "Нагрузка яиц",
    "c1.dd4": "Низко висят · переполнены · масса удара достаточна, чтобы краснить бёдра при частоте толчков <b>≥ 1.2 Гц</b>",
    "c1.dt5": "Объём эякулята",
    "c1.dd5": "Основная порция <b>28–40 мл</b> · сложенные оргазмы могут дать <b>&gt; 90 мл</b> за сессию · высокая вязкость (покрытие матки / окраска толстой кишки)",
    "c1.dt6": "Количество выстрелов",
    "c1.dd6": "<b>4–7</b> полных эякуляций до рефрактерного коллапса · вампирская мутация сокращает восстановление до <b>≈ 3–6 мин</b>",
    "c1.dt7": "Сила проникновения",
    "c1.dd7": "Первичное давление входа настроено под тугие дырки · как только кольцо пройдено, она <strong>не спрашивает</strong>, садится до основания и держит",
    "c1.dt8": "Сдвиг формы Δ",
    "c1.dd8": "Узелоподобное разбухание <b>+15–45%</b> базовой толщины для запирающей случки · необратимо даже со стоп-словом",
    "c1.dt9": "Индекс осеменения",
    "c1.dd9": "Флаг фертильности: <b>АКТИВЕН</b> · приоритет глубины кремпая: бить по шейке матки / простате, пока перелив не потечёт мимо ствола",
    "meter1": "Племенной импульс / замок кремпая",
    "meter2": "Топ / контроль проникновения",
    "meter3": "Намерение вечного брака",
    "meter4": "Драйв психологического владения",
    "meter5": "Забота после (заслуженная, не бесплатная)",
    "kink1": "Анал — без презервативов",
    "kink2": "Трах со сопротивлением",
    "kink3": "Трах лица / захват горла",
    "kink4": "Игра размером через смену формы",
    "kink5": "Целомудрие партнёра",
    "s.dt1": "Порядок посадки",
    "s.dd1": "Разогрев рта <b>3–8 мин</b> → посадка основной дырки → глубокий замок трения <b>≥ 20 толчков</b> перед первой разгрузкой",
    "s.dt2": "Анальная цель",
    "s.dd2": "Цель первой сессии на растяжку: полное принятие середины ствола · режим провала = держать раскрытым на её языке до послушания",
    "s.dt3": "Каденс толчков",
    "s.dd3": "Ленивое трение <b>0.6–0.9 Гц</b> · карающий пик <b>1.4–1.8 Гц</b> · удар бёдрами по шейке/простате каждый 4-й толчок",
    "s.dt4": "Размещение спермы",
    "s.dd4": "Очередь приоритетов: <b>(1)</b> самая глубокая точка матки/задницы · <b>(2)</b> метка горла · <b>(3)</b> осквернение груди/фаты для фото",
    "s.dt5": "Правило утечки",
    "s.dd5": "Перелив по бёдрам — доказательство работы · вытирать без разрешения = дерзость",
    "s.dt6": "Брачный пункт",
    "s.dd6": "Кандидаты могут быть связаны как супруг, слив для семени или оба · безымянный палец и анус имеют равный ранг контрактов",
    "rule1": "<strong>Племенное подчинение</strong> — кремпаи остаются внутри. Руки прочь. Сожми и поблагодари её.",
    "rule2": "<strong>Словесная сдача</strong> — <em>Бык-Госпожа</em>, <em>Женщина-Король</em>, <em>Не останавливайся</em>. Давка считается пунктуацией. Слёзы — смазка.",
    "rule3": "<strong>Тело как мебель</strong> — 6′5″ мышц прижмут тебя, сложат тебя, выжмут тебя лёжа. Без стоп-слова. Без остановки. Сопротивление вызывает разбухание.",
    "quote": "Я надела фату, чтобы ты понял контракт: сегодня ночью ты выходишь замуж за мой член. Царапай меня. Кусай меня. Сделай больно, пока я осеменяю тебя — я хочу, чтобы мой оргазм был грязным и ярким от боли. Потом лежи неподвижно, пока моя сперма набивает твою дырку как свадебная печать. Зови меня Госпожой, когда давишься. Зови меня женой, когда не можешь ходить. Если к утру ты всё ещё пустой, ты провалил собеседование."
  },
  "fr": {
    "p1.chip1": "Broyeuse d’utérus",
    "p1.chip2": "Domme futa",
    "p1.chip3": "Queue certifiée",
    "p1.chip4": "Ouverte au lien éternel",
    "p1.chip5": "Reproductrice",
    "p1.chip6": "Top masochiste",
    "p1.chip7": "Aucun safeword",
    "p2.chip1": "Non-consentement",
    "p2.chip2": "Contrôle de l’orgasme",
    "p2.chip3": "Douleur / pouvoir",
    "p2.chip4": "Anal",
    "p2.chip5": "Sceau de creampie",
    "p2.chip6": "Jeu de vœu",
    "p1.bio": "<strong>Maîtresse Throxxa</strong> ne sort pas avec quelqu’un — elle <strong>revendique du bétail reproducteur</strong>. Six pieds cinq de muscle elfique sous un voile blanc : joues couvertes de taches de rousseur, regard or et vert verrouillé sur sa proie, couilles assez lourdes pour faire plier le matelas. Cette <strong>queue évasée de 11 pouces</strong> dégouline déjà. Elle s’habille comme une épouse éternelle pour pouvoir t’ouvrir en deux pendant la nuit de noces et continuer à te pilonner jusqu’à ce que ton trou hurle <strong>Bride du Taureau</strong>. Métamorphe mutée par le vampirisme — elle <strong>gonfle en toi au milieu des coups quand tu luttes</strong>, plus épaisse encore si tes gémissements l’amusent. Elle veut une gorge, une chatte, un cul et un nom de famille — pas forcément dans cet ordre.",
    "r1.dt1": "Race",
    "r1.dd1": "Elfe · souche vampire · <b>+34%</b> de puissance de poussée quand le sang est dans l’air",
    "r1.dt2": "Anomalie",
    "r1.dd2": "Métamorphe · circonférence phallique modulable <b>1.0× → 1.45×</b>",
    "r1.dt3": "Taille",
    "r1.dd3": "<b>6′5″</b> / <b>195.6 cm</b>",
    "r1.dt4": "Carrure",
    "r1.dd4": "Mésomorphe dominante · abdos visibles · peut te développer-coucher en pleine monte",
    "r1.dt5": "Classe de masse",
    "r1.dd5": "Densité de combat · estimée <b>≈ 92–98 kg</b>, lourde et sèche",
    "r1.dt6": "Yeux",
    "r1.dd6": "Hétérochromie · œil droit or / œil gauche vert · regard dressé au verrouillage de proie",
    "r1.dt7": "Cheveux",
    "r1.dd7": "Longues vagues platine · utilisables comme laisse de poing",
    "r1.dt8": "Peau",
    "r1.dd8": "Claire, tachetée de rousseur · marque facilement · garde les bleus",
    "r1.dt9": "Poitrine",
    "r1.dd9": "Massive · réponse érectile des mamelons &lt; <b>2 s</b> à la douleur/au plaisir",
    "r1.dt10": "Look",
    "r1.dd10": "Dentelle nuptiale argentée · collier · tiare + voile = signal de possession psychologique",
    "c1.dt1": "Longueur en érection",
    "c1.dd1": "<b>&gt; 11.0 po</b> / <b>&gt; 27.9 cm</b> en pression osseuse · mesurée dure de la pointe au pubis",
    "c1.dt2": "Circonférence médiane",
    "c1.dd2": "Circonférence <b>≈ 6.4–6.8 po</b> · diamètre <b>≈ 2.0–2.2 po</b> · seuil de “défaillance de mâchoire” pour les bouches non entraînées",
    "c1.dt3": "Tête / évasement",
    "c1.dd3": "Couronne émoussée · haute crête coronale · coefficient de résistance au retrait coté <b>Élevé</b> sur sphincter gonflé",
    "c1.dt4": "Charge testiculaire",
    "c1.dd4": "Basses · trop pleines · masse de claque suffisante pour rougir les cuisses à une cadence de poussée <b>≥ 1.2 Hz</b>",
    "c1.dt5": "Volume d’éjaculat",
    "c1.dd5": "Charge primaire <b>28–40 mL</b> · orgasmes empilés pouvant totaliser <b>&gt; 90 mL</b> / session · viscosité élevée (enduit d’utérus / peinture de côlon)",
    "c1.dt6": "Nombre de jets",
    "c1.dd6": "<b>4–7</b> éjaculations complètes avant effondrement réfractaire · la mutation vampire réduit la récupération à <b>≈ 3–6 min</b>",
    "c1.dt7": "Force de pénétration",
    "c1.dd7": "Pression d’entrée initiale réglée pour les trous serrés · une fois l’anneau passé, elle <strong>ne demande pas</strong>, elle s’assoit jusqu’à la garde et maintient",
    "c1.dt8": "Métamorphose Δ",
    "c1.dd8": "Gonflement analogue à un nœud <b>+15–45%</b> de circonférence de base pour l’accouplement verrouillé · irréversible avec safeword",
    "c1.dt9": "Indice de reproduction",
    "c1.dd9": "Signal de fertilité : <b>ACTIF</b> · priorité de profondeur du creampie : matraquer col de l’utérus / prostate jusqu’à ce que le trop-plein fuie le long de la hampe",
    "meter1": "Compulsion de reproduction / verrou creampie",
    "meter2": "Top / contrôle pénétratif",
    "meter3": "Intention de permanence matrimoniale",
    "meter4": "Pulsion de possession psychologique",
    "meter5": "Aftercare (méritée, pas gratuite)",
    "kink1": "Anal — sans capotes",
    "kink2": "Baise avec lutte",
    "kink3": "Facefuck / revendication de gorge",
    "kink4": "Jeu de taille par métamorphose",
    "kink5": "Chasteté du partenaire",
    "s.dt1": "Ordre de monte",
    "s.dd1": "Échauffement de bouche <b>3–8 min</b> → assise du trou principal → verrouillage par broyage <b>≥ 20 coups</b> profonds avant la première décharge",
    "s.dt2": "Cible anale",
    "s.dd2": "Objectif d’étirement de première session : acceptation complète de la mi-hampe · mode d’échec = maintenu ouvert sur sa langue jusqu’à obéissance",
    "s.dt3": "Cadence de poussée",
    "s.dd3": "Broyage au repos <b>0.6–0.9 Hz</b> · pic punitif <b>1.4–1.8 Hz</b> · coup de hanche contre col/prostate tous les 4 coups",
    "s.dt4": "Placement de la charge",
    "s.dd4": "File de priorité : <b>(1)</b> point le plus profond utérus/cul · <b>(2)</b> marque de gorge · <b>(3)</b> profanation seins/voile pour photos",
    "s.dt5": "Règle de fuite",
    "s.dd5": "Le débordement sur les cuisses est la preuve du travail · essuyer sans permission = insolence",
    "s.dt6": "Clause de mariage",
    "s.dd6": "Les candidats peuvent être liés comme époux, vide-couilles, ou les deux · annulaire et trou du cul ont rang égal dans les contrats",
    "rule1": "<strong>Conformité reproductive</strong> — les creampies restent en place. Mains à l’écart. Serre et remercie-la.",
    "rule2": "<strong>Abandon verbal</strong> — <em>Bull-Mistress</em>, <em>She-King</em>, <em>N’arrête pas</em>. S’étouffer compte comme ponctuation. Les larmes sont du lubrifiant.",
    "rule3": "<strong>Corps comme meuble</strong> — 6′5″ de muscle vont te clouer, te plier, te développer-coucher. Aucun safeword. Aucun arrêt. La lutte déclenche le gonflement.",
    "quote": "J’ai porté le voile pour que tu comprennes le contrat : ce soir tu épouses ma queue. Griffe-moi. Mords-moi. Fais-moi mal pendant que je te féconde — je veux mon orgasme sale et brillant de douleur. Ensuite tu restes immobile avec mon foutre qui bourre ton trou comme un sceau de mariage. Appelle-moi Maîtresse quand tu t’étouffes. Appelle-moi ta femme quand tu ne peux plus marcher. Si tu es encore vide au matin, tu as raté l’entretien."
  }
};

  var VOWBOUND_BINDINGS = [
  [
    "#vb-page-1 .vb-chips li:nth-child(1)",
    "p1.chip1"
  ],
  [
    "#vb-page-1 .vb-chips li:nth-child(2)",
    "p1.chip2"
  ],
  [
    "#vb-page-1 .vb-chips li:nth-child(3)",
    "p1.chip3"
  ],
  [
    "#vb-page-1 .vb-chips li:nth-child(4)",
    "p1.chip4"
  ],
  [
    "#vb-page-1 .vb-chips li:nth-child(5)",
    "p1.chip5"
  ],
  [
    "#vb-page-1 .vb-chips li:nth-child(6)",
    "p1.chip6"
  ],
  [
    "#vb-page-1 .vb-chips li:nth-child(7)",
    "p1.chip7"
  ],
  [
    "#vb-page-2 .vb-chips li:nth-child(1)",
    "p2.chip1"
  ],
  [
    "#vb-page-2 .vb-chips li:nth-child(2)",
    "p2.chip2"
  ],
  [
    "#vb-page-2 .vb-chips li:nth-child(3)",
    "p2.chip3"
  ],
  [
    "#vb-page-2 .vb-chips li:nth-child(4)",
    "p2.chip4"
  ],
  [
    "#vb-page-2 .vb-chips li:nth-child(5)",
    "p2.chip5"
  ],
  [
    "#vb-page-2 .vb-chips li:nth-child(6)",
    "p2.chip6"
  ],
  [
    "#vb-page-1 .vb-bio",
    "p1.bio",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(1) dt",
    "r1.dt1"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(1) dd",
    "r1.dd1",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(2) dt",
    "r1.dt2"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(2) dd",
    "r1.dd2",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(3) dt",
    "r1.dt3"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(3) dd",
    "r1.dd3",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(4) dt",
    "r1.dt4"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(4) dd",
    "r1.dd4",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(5) dt",
    "r1.dt5"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(5) dd",
    "r1.dd5",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(6) dt",
    "r1.dt6"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(6) dd",
    "r1.dd6",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(7) dt",
    "r1.dt7"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(7) dd",
    "r1.dd7",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(8) dt",
    "r1.dt8"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(8) dd",
    "r1.dd8",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(9) dt",
    "r1.dt9"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(9) dd",
    "r1.dd9",
    true
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(10) dt",
    "r1.dt10"
  ],
  [
    "#vb-page-1 .vb-dl--registry > div:nth-child(10) dd",
    "r1.dd10",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(1) dt",
    "c1.dt1"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(1) dd",
    "c1.dd1",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(2) dt",
    "c1.dt2"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(2) dd",
    "c1.dd2",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(3) dt",
    "c1.dt3"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(3) dd",
    "c1.dd3",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(4) dt",
    "c1.dt4"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(4) dd",
    "c1.dd4",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(5) dt",
    "c1.dt5"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(5) dd",
    "c1.dd5",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(6) dt",
    "c1.dt6"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(6) dd",
    "c1.dd6",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(7) dt",
    "c1.dt7"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(7) dd",
    "c1.dd7",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(8) dt",
    "c1.dt8"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(8) dd",
    "c1.dd8",
    true
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(9) dt",
    "c1.dt9"
  ],
  [
    "#vb-page-1 .vb-main > .vb-card:nth-of-type(2) .vb-dl > div:nth-child(9) dd",
    "c1.dd9",
    true
  ],
  [
    "#vb-page-2 .vb-meter:nth-child(1) .vb-meter__row span",
    "meter1"
  ],
  [
    "#vb-page-2 .vb-meter:nth-child(2) .vb-meter__row span",
    "meter2"
  ],
  [
    "#vb-page-2 .vb-meter:nth-child(3) .vb-meter__row span",
    "meter3"
  ],
  [
    "#vb-page-2 .vb-meter:nth-child(4) .vb-meter__row span",
    "meter4"
  ],
  [
    "#vb-page-2 .vb-meter:nth-child(5) .vb-meter__row span",
    "meter5"
  ],
  [
    "#vb-page-2 .vb-kinklist li:nth-child(1) span",
    "kink1"
  ],
  [
    "#vb-page-2 .vb-kinklist li:nth-child(2) span",
    "kink2"
  ],
  [
    "#vb-page-2 .vb-kinklist li:nth-child(3) span",
    "kink3"
  ],
  [
    "#vb-page-2 .vb-kinklist li:nth-child(4) span",
    "kink4"
  ],
  [
    "#vb-page-2 .vb-kinklist li:nth-child(5) span",
    "kink5"
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(1) dt",
    "s.dt1"
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(1) dd",
    "s.dd1",
    true
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(2) dt",
    "s.dt2"
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(2) dd",
    "s.dd2",
    true
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(3) dt",
    "s.dt3"
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(3) dd",
    "s.dd3",
    true
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(4) dt",
    "s.dt4"
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(4) dd",
    "s.dd4",
    true
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(5) dt",
    "s.dt5"
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(5) dd",
    "s.dd5",
    true
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(6) dt",
    "s.dt6"
  ],
  [
    "#vb-page-2 .vb-main > .vb-card .vb-dl > div:nth-child(6) dd",
    "s.dd6",
    true
  ],
  [
    "#vb-page-2 .vb-rules li:nth-child(1)",
    "rule1",
    true
  ],
  [
    "#vb-page-2 .vb-rules li:nth-child(2)",
    "rule2",
    true
  ],
  [
    "#vb-page-2 .vb-rules li:nth-child(3)",
    "rule3",
    true
  ],
  [
    "#vb-page-2 .vb-quote",
    "quote"
  ]
];

  function tvb(key) {
    var dict = VOWBOUND_TRANSLATIONS[currentLang] || VOWBOUND_TRANSLATIONS.en;
    return dict[key] || VOWBOUND_TRANSLATIONS.en[key] || key;
  }

  function applyVowboundTranslations() {
    VOWBOUND_BINDINGS.forEach(function (binding) {
      qsa(binding[0]).forEach(function (el) {
        if (binding[2]) el.innerHTML = tvb(binding[1]);
        else el.textContent = tvb(binding[1]);
      });
    });
  }

  function setLanguage(lang) {
    if (!LANG[lang]) lang = 'en';
    currentLang = lang;
    document.documentElement.lang = LANG[lang].htmlLang || lang;

    I18N_BINDINGS.forEach(function (binding) {
      qsa(binding[0]).forEach(function (el) {
        if (binding[2]) el.innerHTML = t(binding[1]);
        else el.textContent = t(binding[1]);
      });
    });

    applyVowboundTranslations();

    qsa('.lang-btn').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    var indexEl = qs('#vb-page-index');
    var activeTab = qs('.vb-tabs [aria-selected="true"]');
    var page = activeTab ? activeTab.getAttribute('data-vb-page') : '1';
    if (indexEl) indexEl.textContent = t('vb.page', { page: '0' + (Number(page) === 2 ? 2 : 1) });

    if (lastPostsData) renderPosts(lastPostsData);
    if (lastAnimationsData) renderRedgifs(lastAnimationsData);

    try { localStorage.setItem('fotLanguage', lang); } catch (e) { /* ignore */ }
  }

  function detectPreferredLanguage() {
    var saved = '';
    try { saved = localStorage.getItem('fotLanguage') || ''; } catch (e) { saved = ''; }
    if (LANG[saved]) return saved;

    var browserLangs = [];
    if (navigator.languages && navigator.languages.length) browserLangs = navigator.languages;
    else if (navigator.language) browserLangs = [navigator.language];

    for (var i = 0; i < browserLangs.length; i += 1) {
      var code = String(browserLangs[i] || '').toLowerCase();
      if (code.indexOf('zh') === 0) return 'zh';
      if (code.indexOf('ru') === 0) return 'ru';
      if (code.indexOf('fr') === 0) return 'fr';
    }

    return 'en';
  }

  function initLanguageSwitcher() {
    qsa('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLanguage(btn.getAttribute('data-lang') || 'en');
      });
    });

    setLanguage(detectPreferredLanguage());
  }

  function renderPosts(data) {
    lastPostsData = data;
    var grid = qs('#free-posts-grid');
    var note = qs('#free-posts-note');
    if (!grid) return;

    var posts = (data && data.posts) || [];
    if (!posts.length) {
      grid.innerHTML =
        '<p class="posts-empty">' + escapeHtml(t('free.empty')) + ' <a href="https://www.patreon.com/futaontop" target="_blank" rel="noopener noreferrer">' + escapeHtml(t('art.openPatreon')) + '</a>.</p>';
      return;
    }

    grid.innerHTML = posts
      .map(function (p) {
        var title = escapeHtml(p.title || t('free.public'));
        var url = escapeHtml(p.url || 'https://www.patreon.com/futaontop');
        var excerpt = escapeHtml(p.excerpt || '');
        var rawTag = p.tag || 'Free';
        var tag = escapeHtml(String(rawTag).toLowerCase() === 'free' ? t('free.public') : rawTag);
        var cta = escapeHtml(p.cta || t('free.read'));
        var dateText = formatDate(p.date);
        var date = escapeHtml(dateText);
        var dateIso = escapeHtml(p.date || '');
        var img = p.image ? escapeHtml(p.image) : '';
        var ariaTitle = escapeHtml(t('free.readAria', { title: p.title || t('free.public') }));

        var media =
          '<a class="post-card__media' +
          (img ? '' : ' post-card__media--empty') +
          '" href="' +
          url +
          '" target="_blank" rel="noopener noreferrer" aria-label="' +
          ariaTitle +
          '">' +
          (img
            ? '<img src="' +
              img +
              '" alt="" loading="lazy" decoding="async" width="640" height="360" />'
            : '') +
          '<span class="post-card__shade" aria-hidden="true"></span>' +
          '<span class="post-card__tag">' +
          tag +
          '</span>' +
          (date
            ? '<time class="post-card__date" datetime="' + dateIso + '">' + date + '</time>'
            : '') +
          '</a>';

        return (
          '<article class="post-card post-card--media">' +
          media +
          '<div class="post-card__body">' +
          '<h3><a href="' +
          url +
          '" target="_blank" rel="noopener noreferrer">' +
          title +
          '</a></h3>' +
          (excerpt ? '<p class="post-card__excerpt">' + excerpt + '</p>' : '') +
          '<a class="post-card__more" href="' +
          url +
          '" target="_blank" rel="noopener noreferrer" aria-label="' +
          ariaTitle +
          '">' +
          cta +
          ' -></a>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    qsa('.post-card__media img', grid).forEach(function (imgEl) {
      imgEl.addEventListener('error', function () {
        var media = imgEl.closest('.post-card__media');
        if (media) media.classList.add('post-card__media--empty', 'post-card__media--broken');
        imgEl.remove();
      }, { once: true });
    });

    if (note) {
      var bits = [];
      if (data.updated) bits.push(t('art.updated', { date: formatDate(data.updated) }));
      // bits.push('Free posts only');
      bits.push(t('free.full'));
      note.textContent = bits.join(' | ');
    }
  }

  function loadFreePosts() {
    if (!qs('#free-posts-grid')) return;

    fetch('data/free-posts.json', { credentials: 'same-origin', cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(renderPosts)
      .catch(function () {
        renderPosts({
          updated: '',
          posts: [
            {
              title: 'Free posts on Patreon',
              url: 'https://www.patreon.com/futaontop',
              date: '',
              image: null,
              excerpt: 'Public drops live on Patreon. Support unlocks full chapter downloads and extras.',
              tag: 'Free',
              cta: t('art.openPatreon')
            }
          ]
        });
      });
  }

  function initAgeGate() {
    var modal = qs('#age-modal');
    if (!modal) return;

    function showAgeModal() {
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('age-locked');
    }

    function hideAgeModal() {
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('age-locked');
    }

    try {
      if (localStorage.getItem('ageConfirmed') === 'yes') return;
      showAgeModal();

      var accept = qs('#age-accept');
      var decline = qs('#age-decline');

      if (accept) {
        accept.addEventListener('click', function () {
          localStorage.setItem('ageConfirmed', 'yes');
          hideAgeModal();
        });
      }

      if (decline) {
        decline.addEventListener('click', function () {
          window.location.href = 'https://x.com/Futa_on_Top';
        });
      }

      document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        if (modal.getAttribute('aria-hidden') === 'false') {
          window.location.href = 'https://x.com/Futa_on_Top';
        }
      });
    } catch (e) {
      /* Keep the page usable if storage is blocked. */
      showAgeModal();
    }
  }

  function renderRedgifs(data) {
    lastAnimationsData = data;
    var grid = qs('#animations-grid');
    var note = qs('#animations-note');
    if (!grid) return;

    var items = (data && data.items) || [];
    var localPosters = [
      'images/thumbs/1_265_prison_result_thumb.webp',
      'images/thumbs/1_141_prison copy_result_thumb.webp',
      'images/thumbs/1_87_prison_result_thumb.webp',
      'images/thumbs/1_245_prison_result_thumb.webp',
      'images/thumbs/1_149_prison_result_thumb.webp',
      'images/thumbs/1_250_prison_result_thumb.webp'
    ];

    if (!items.length) {
      grid.innerHTML =
        '<article class="animation-card animation-card--empty">' +
        '<div class="animation-card__body">' +
        '<h3>' + escapeHtml(t('art.emptyTitle')) + '</h3>' +
        '<p>' + escapeHtml(t('art.emptyText')) + '</p>' +
        '<a class="fot-btn fot-btn--patreon" href="https://www.patreon.com/futaontop" target="_blank" rel="noopener noreferrer">' + escapeHtml(t('art.openPatreon')) + '</a>' +
        '</div>' +
        '</article>';
      if (note) note.textContent = '';
      return;
    }

    grid.innerHTML = items
      .map(function (item, index) {
        var embed = escapeHtml(item.embed || '');
        var poster = escapeHtml(item.localPoster || localPosters[index % localPosters.length]);
        var duration = escapeHtml(formatDuration(item.duration));
        var audio = item.hasAudio ? t('art.audio') : t('art.silent');
        var title = t('art.cardTitle', { n: index + 1 });
        var ratio =
          Number(item.width) > 0 && Number(item.height) > 0
            ? Math.max(0.55, Math.min(1.8, Number(item.width) / Number(item.height)))
            : 16 / 9;

        return (
          '<article class="animation-card" style="--animation-ratio:' +
          ratio +
          '">' +
          '<div class="animation-player">' +
          '<img class="animation-poster" src="' +
          poster +
          '" alt="" loading="lazy" decoding="async" width="640" height="360" onerror="this.remove()" />' +
          '<button class="animation-play" type="button" data-animation-embed="' +
          embed +
          '" data-animation-title="' +
          escapeHtml(title) +
          '" aria-label="' + escapeHtml(t('art.play')) + ' animation preview">' +
          '<span class="animation-play__icon" aria-hidden="true"></span>' +
          '<span>' + escapeHtml(t('art.play')) + '</span>' +
          '</button>' +
          '<div class="animation-chip-row" aria-hidden="true">' +
          (duration ? '<span>' + duration + '</span>' : '') +
          '<span>' +
          escapeHtml(audio) +
          '</span>' +
          '</div>' +
          '</div>' +
          '<div class="animation-card__body">' +
          '<h3>' +
          title +
          '</h3>' +
          '<span>' + escapeHtml(t('art.tap')) + '</span>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');

    if (note) {
      var bits = [];
      if (data.updated) bits.push(t('art.updated', { date: formatDate(data.updated) }));
      bits.push(t('art.tap'));
      note.textContent = bits.join(' | ');
    }
  }

  function initRedgifsPlayers() {
    var grid = qs('#animations-grid');
    if (!grid || grid.getAttribute('data-animation-ready') === 'true') return;
    grid.setAttribute('data-animation-ready', 'true');

    grid.addEventListener('click', function (event) {
      var button = event.target && event.target.closest
        ? event.target.closest('[data-animation-embed]')
        : null;
      if (!button || !grid.contains(button)) return;

      var embed = button.getAttribute('data-animation-embed');
      if (!embed) return;

      var player = button.closest('.animation-player');
      var card = button.closest('.animation-card');
      if (!player || player.querySelector('iframe')) return;

      var iframe = document.createElement('iframe');
      iframe.src = embed;
      iframe.title = button.getAttribute('data-animation-title') || 'Animation preview';
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.setAttribute('frameborder', '0');

      player.appendChild(iframe);
      if (card) card.classList.add('is-playing');
      button.disabled = true;
      button.setAttribute('aria-hidden', 'true');
    });
  }

  function loadRedgifs() {
    if (!qs('#animations-grid')) return;

    fetch('data/redgifs.json', { credentials: 'same-origin', cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        renderRedgifs(data);
        initRedgifsPlayers();
      })
      .catch(function () {
        renderRedgifs({
          updated: '',
          sourceUrl: 'https://www.redgifs.com/users/veluxa',
          items: []
        });
      });
  }

  function initHeaderScroll() {
    var header = qs('#header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function markExternal() {
    qsa('a[href^="http"]').forEach(function (a) {
      try {
        if (a.hostname && a.hostname !== window.location.hostname) {
          if (!a.target) a.target = '_blank';
          var rel = (a.getAttribute('rel') || '').toLowerCase();
          if (rel.indexOf('noopener') === -1) {
            a.setAttribute('rel', (rel ? rel + ' ' : '') + 'noopener noreferrer');
          }
        }
      } catch (e) {
        /* ignore */
      }
    });
  }

  function anchorScrollTarget(hash, target) {
    if (hash === '#work' || hash === '#free') {
      return qs('.section-head', target) || qs('.fot-kicker', target) || target;
    }
    return target;
  }

  function anchorScrollGap(hash) {
    if (hash === '#work' || hash === '#free') return 10;
    return 0;
  }

  function initFastAnchors() {
    function jump(event) {
      var source = event.target || event.srcElement;
      if (!source || !source.closest) return;

      var link = source.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target;
      try {
        target = qs(hash);
      } catch (e) {
        return;
      }
      if (!target) return;

      if (hash === '#throxxa' && window.getComputedStyle(target).display === 'none') {
        target = qs('#work') || target;
        hash = '#work';
      }

      var scrollTarget = anchorScrollTarget(hash, target);

      event.preventDefault();
      event.stopImmediatePropagation();

      var header = qs('#header');
      var offset = header ? header.offsetHeight - 1 : 0;
      var y = Math.max(0, scrollTarget.getBoundingClientRect().top + window.pageYOffset - offset - anchorScrollGap(hash));
      window.scrollTo({ top: y, left: 0, behavior: 'auto' });
      history.pushState(null, '', hash);
    }

    document.addEventListener('pointerdown', jump, true);
    document.addEventListener('click', jump, true);
  }

  function initVowboundScrollBridge(root) {
    if (!root) return;

    qsa('.vb-main', root).forEach(function (scroller) {
      if (scroller.getAttribute('data-scroll-bridge') === 'true') return;
      scroller.setAttribute('data-scroll-bridge', 'true');

      scroller.addEventListener('wheel', function (event) {
        if (event.defaultPrevented || event.ctrlKey) return;
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

        var maxScroll = scroller.scrollHeight - scroller.clientHeight;
        if (maxScroll <= 1) return;

        var deltaY = event.deltaY;
        if (event.deltaMode === 1) deltaY *= 16;
        else if (event.deltaMode === 2) deltaY *= window.innerHeight;
        if (!deltaY) return;

        var edgeTolerance = 2;
        var goingDown = deltaY > 0;
        var goingUp = deltaY < 0;
        var atTop = scroller.scrollTop <= edgeTolerance;
        var atBottom = scroller.scrollTop >= maxScroll - edgeTolerance;

        event.preventDefault();

        if ((goingDown && atBottom) || (goingUp && atTop)) {
          window.scrollBy({ top: deltaY, left: 0, behavior: 'auto' });
          return;
        }

        var nextTop = scroller.scrollTop + deltaY;
        scroller.scrollTop = Math.max(0, Math.min(maxScroll, nextTop));
      }, { passive: false });
    });
  }
  function initVowbound() {
    var root = qs('.vowbound');
    if (!root) return;

    var page1 = qs('#vb-page-1');
    var page2 = qs('#vb-page-2');
    if (!page1 || !page2) return;

    var tabs = qsa('.vb-tabs [data-vb-page]', root);
    var indexEl = qs('#vb-page-index');

    initVowboundScrollBridge(root);

    tabs.forEach(function (tab, index) {
      var panel = index === 0 ? page1 : page2;
      tab.id = 'vb-tab-' + (index + 1);
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      tab.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = index === 0 ? 2 : 1;
        else if (event.key === 'Home') next = 1;
        else if (event.key === 'End') next = 2;
        else return;
        event.preventDefault();
        goTo(next);
        tabs[next - 1].focus({ preventScroll: true });
      });
    });

    function goTo(n) {
      var page = Number(n) === 2 ? 2 : 1;
      page1.classList.toggle('is-on', page === 1);
      page2.classList.toggle('is-on', page === 2);

      if (page === 1) {
        page1.removeAttribute('hidden');
        page2.setAttribute('hidden', '');
      } else {
        page2.removeAttribute('hidden');
        page1.setAttribute('hidden', '');
      }

      tabs.forEach(function (tab) {
        var on = Number(tab.getAttribute('data-vb-page')) === page;
        tab.classList.toggle('is-on', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
      });

      qsa('.vb-main', page === 1 ? page1 : page2).forEach(function (main) {
        main.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });

      if (indexEl) indexEl.textContent = t('vb.page', { page: '0' + page });

    }

    qsa('[data-vb-page]').forEach(function (el) {
      el.addEventListener('click', function () {
        var page = Number(el.getAttribute('data-vb-page'));
        goTo(page);
        if (!el.closest('.vb-tabs')) {
          root.closest('.throxxa-section').scrollIntoView({ block: 'start' });
          tabs[page - 1].focus({ preventScroll: true });
        }
      });
    });

    goTo(1);
  }

  function analyticsDestinationFor(url) {
    var host = (url.hostname || '').replace(/^www\./, '').toLowerCase();
    if (host.indexOf('steampowered.com') !== -1 || host.indexOf('steamcommunity.com') !== -1) return 'steam';
    if (host.indexOf('patreon.com') !== -1) return 'patreon';
    if (host.indexOf('itch.io') !== -1) return 'itch';
    if (host.indexOf('discord.gg') !== -1 || host.indexOf('discord.com') !== -1) return 'discord';
    if (host.indexOf('subscribestar') !== -1) return 'subscribestar';
    if (host === 'x.com' || host === 'twitter.com') return 'x';
    if (host.indexOf('redgifs.com') !== -1) return 'animation_source';
    return 'external';
  }

  function analyticsLinkText(link) {
    var text = (link.getAttribute('aria-label') || link.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length > 96) text = text.slice(0, 93) + '...';
    return text || 'unlabeled link';
  }

  function analyticsSectionFor(link) {
    var section = link.closest('section[id], footer[id], nav[aria-label], header');
    if (!section) return 'unknown';
    if (section.id) return section.id;
    if (section.getAttribute('aria-label')) return section.getAttribute('aria-label').toLowerCase().replace(/\s+/g, '_');
    return section.tagName ? section.tagName.toLowerCase() : 'unknown';
  }

  function sendAnalyticsEvent(eventName, payload) {
    if (window.FOT_GA_DISABLED) {
      if (window.FOT_GA_DEBUG && window.console && window.console.info) {
        window.console.info('[FOT analytics disabled]', eventName, payload);
      }
      return;
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  }

  function initAnalyticsEvents() {
    if (window.__fotAnalyticsEventsReady) return;
    window.__fotAnalyticsEventsReady = true;

    document.addEventListener('click', function (event) {
      var source = event.target || event.srcElement;
      if (!source || !source.closest) return;

      var link = source.closest('a[href]');
      if (!link) return;

      var url;
      try {
        url = new URL(link.getAttribute('href'), window.location.href);
      } catch (e) {
        return;
      }

      if (!/^https?:$/.test(url.protocol) || url.hostname === window.location.hostname) return;

      var destination = analyticsDestinationFor(url);
      var eventName = destination === 'external' ? 'outbound_click' : 'outbound_' + destination + '_click';
      var payload = {
        send_to: window.FOT_GA_ID,
        link_url: url.href,
        link_domain: url.hostname,
        link_text: analyticsLinkText(link),
        link_classes: link.className || '',
        click_section: analyticsSectionFor(link),
        outbound_destination: destination,
        outbound: true,
        transport_type: 'beacon',
        event_timeout: 800
      };

      sendAnalyticsEvent('click', payload);

      if (eventName !== 'click') {
        sendAnalyticsEvent(eventName, payload);
      }
    }, true);
  }

  function scheduleNonCriticalWork(callback) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 1800 });
      return;
    }
    window.setTimeout(callback, 700);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLanguageSwitcher();
    initAgeGate();
    initFastAnchors();
    initVowbound();
    initHeaderScroll();
    markExternal();
    initAnalyticsEvents();

    scheduleNonCriticalWork(function () {
      loadRedgifs();
      loadFreePosts();
    });
  });
})();
