export interface ProfessionItem {
  id: string;
  name: string;
  bCodes: string[]; // e.g. ["B057", "B059"]
  keywords: string[]; // keywords for string matching fallback
}

export interface SubcategoryItem {
  id: string;
  name: string;
  professions: ProfessionItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string; // Emoji representing the category
  subcategories: SubcategoryItem[];
}

export const KAZ_PROFESSION_CATEGORIES: CategoryItem[] = [
  {
    id: "it",
    name: "IT и цифровая индустрия",
    icon: "💻",
    subcategories: [
      {
        id: "software_dev",
        name: "Разработка ПО",
        professions: [
          { id: "backend", name: "Backend-разработчик", bCodes: ["B057", "B059"], keywords: ["разработка", "программ", "информацион", "вычислитель", "it"] },
          { id: "frontend", name: "Frontend-разработчик", bCodes: ["B057", "B059"], keywords: ["разработка", "веб", "интерфейс", "it", "веб-дизайн"] },
          { id: "fullstack", name: "Fullstack-разработчик", bCodes: ["B057", "B059"], keywords: ["разработка", "программ", "веб", "it"] },
          { id: "mobile", name: "Mobile-разработчик", bCodes: ["B057", "B059"], keywords: ["мобильн", "разработка", "it"] },
          { id: "android", name: "Android-разработчик", bCodes: ["B057", "B059"], keywords: ["android", "разработка", "it"] },
          { id: "ios", name: "iOS-разработчик", bCodes: ["B057", "B059"], keywords: ["ios", "разработка", "swift", "it"] },
          { id: "game_dev", name: "Game Developer", bCodes: ["B057"], keywords: ["игр", "компьютерн", "разработка", "it"] },
          { id: "ai_dev", name: "AI-разработчик / Data Scientist", bCodes: ["B057", "B059"], keywords: ["интеллект", "искусствен", "данн", "анализ", "machine", "data"] },
          { id: "devops", name: "DevOps Engineer", bCodes: ["B057", "B059"], keywords: ["системн", "администр", "инфраструкт", "облачн", "cloud"] },
          { id: "qa", name: "QA Engineer / Тестировщик", bCodes: ["B057"], keywords: ["тестиров", "бизнес-анал", "качество"] },
          { id: "web_dev", name: "Web-разработчик", bCodes: ["B057", "B059"], keywords: ["веб", "интернет", "разработка"] },
          { id: "software_eng", name: "Software Engineer", bCodes: ["B057", "B059"], keywords: ["инженер", "программ", "архитект", "it"] }
        ]
      },
      {
        id: "networks",
        name: "Сети и серверное администрирование",
        professions: [
          { id: "sysadmin", name: "Системный администратор", bCodes: ["B057", "B059"], keywords: ["администр", "систем", "сетев", "сервер"] },
          { id: "net_engineer", name: "Сетевой инженер", bCodes: ["B059"], keywords: ["сетев", "коммуникац", "инженер", "телеком"] },
          { id: "cloud_eng", name: "Cloud Engineer", bCodes: ["B057", "B059"], keywords: ["облачн", "cloud", "инженер"] }
        ]
      },
      {
        id: "cybersecurity",
        name: "Кибербезопасность",
        professions: [
          { id: "pentester", name: "Pentester / Этичный хакер", bCodes: ["B058", "B059"], keywords: ["безопасн", "кибер", "уязвим", "атак"] },
          { id: "soc_analyst", name: "SOC Analyst", bCodes: ["B058"], keywords: ["мониторинг", "безопасн", "информацион"] },
          { id: "security_spec", name: "Специалист по информационной безопасности", bCodes: ["B058"], keywords: ["безопасн", "защита", "информацион", "криптограф"] }
        ]
      },
      {
        id: "it_design",
        name: "Дизайн в IT",
        professions: [
          { id: "ui_ux", name: "UI/UX Designer", bCodes: ["B030", "B057"], keywords: ["интерфейс", "ui", "ux", "дизайн", "веб"] },
          { id: "web_design", name: "Web Designer", bCodes: ["B030", "B057"], keywords: ["веб-дизайн", "дизайн", "сайт"] },
          { id: "graphic_design", name: "Graphic Designer", bCodes: ["B030"], keywords: ["графическ", "дизайн", "иллюстр"] },
          { id: "motion_design", name: "Motion Designer", bCodes: ["B030"], keywords: ["анимац", "движен", "видео", "моушн"] }
        ]
      }
    ]
  },
  {
    id: "medicine",
    name: "Медицина и здравоохранение",
    icon: "🩺",
    subcategories: [
      {
        id: "doctors",
        name: "Врачи и клиника",
        professions: [
          { id: "surgeon", name: "Хирург", bCodes: ["B086"], keywords: ["медицин", "педиатр", "хирург", "врач"] },
          { id: "cardiologist", name: "Кардиолог", bCodes: ["B086"], keywords: ["терап", "врач", "кардиол"] },
          { id: "neurologist", name: "Невролог", bCodes: ["B086"], keywords: ["неврол", "врач", "медицин"] },
          { id: "ophthalmologist", name: "Офтальмолог", bCodes: ["B086"], keywords: ["глазн", "офтальмол", "врач"] },
          { id: "urologist", name: "Уролог", bCodes: ["B086"], keywords: ["уролог", "врач"] },
          { id: "therapist", name: "Терапевт / Врач общей практики", bCodes: ["B086"], keywords: ["терапевт", "врач", "общая", "лечебн"] },
          { id: "resuscitator", name: "Реаниматолог / Анестезиолог", bCodes: ["B086"], keywords: ["реанимац", "анестез", "врач"] },
          { id: "oncologist", name: "Онколог", bCodes: ["B086"], keywords: ["онколог", "врач", "медицин"] }
        ]
      },
      {
        id: "stomatology",
        name: "Стоматология",
        professions: [
          { id: "stomatologist", name: "Стоматолог", bCodes: ["B085"], keywords: ["стоматол", "зубн"] },
          { id: "orthodontist", name: "Ортодонт", bCodes: ["B085"], keywords: ["ортодонт", "стоматол"] },
          { id: "implantologist", name: "Имплантолог", bCodes: ["B085"], keywords: ["имплант", "стоматол"] },
          { id: "maxillofacial_surgeon", name: "Челюстно-лицевой хирург", bCodes: ["B085", "B086"], keywords: ["челюст", "хирург"] }
        ]
      },
      {
        id: "pharmacy",
        name: "Фармация",
        professions: [
          { id: "pharmacist", name: "Фармацевт / Провизор", bCodes: ["B087"], keywords: ["фармац", "аптек", "лек", "провизор"] },
          { id: "clinical_pharma", name: "Клинический фармаколог", bCodes: ["B087"], keywords: ["фармакол", "исследов", "химик-фармац"] }
        ]
      },
      {
        id: "nursing",
        name: "Сестринское дело",
        professions: [
          { id: "nurse", name: "Медсестра / Медбрат", bCodes: ["B084"], keywords: ["сестринск", "уход", "клиник", "медсестра", "медбрат"] }
        ]
      }
    ]
  },
  {
    id: "business",
    name: "Бизнес, Маркетинг и Финансы",
    icon: "📈",
    subcategories: [
      {
        id: "finances",
        name: "Финансы и Инновации",
        professions: [
          { id: "fin_analyst", name: "Финансовый аналитик", bCodes: ["B046"], keywords: ["финанс", "аналитик", "инвест", "рынок"] },
          { id: "banker", name: "Инвестиционный банкир", bCodes: ["B046"], keywords: ["банковск", "инвест", "капитал"] },
          { id: "cfo", name: "Финансовый директор", bCodes: ["B046", "B044"], keywords: ["финанс", "директор", "управлен", "бюджет"] },
          { id: "risk_manager", name: "Риск-менеджер", bCodes: ["B046"], keywords: ["риск", "страхова", "анализ"] }
        ]
      },
      {
        id: "accounting",
        name: "Бухгалтерия и аудит",
        professions: [
          { id: "auditor", name: "Аудитор", bCodes: ["B045", "B046"], keywords: ["аудит", "проверк", "контроль"] },
          { id: "accountant", name: "Главный бухгалтер", bCodes: ["B045", "B046"], keywords: ["бухгал", "учет", "налог"] },
          { id: "tax_consultant", name: "Налоговый консультант", bCodes: ["B045"], keywords: ["налог", "консульт", "фискальн"] }
        ]
      },
      {
        id: "management",
        name: "Менеджмент и управление",
        professions: [
          { id: "project_manager", name: "Проджект-менеджер", bCodes: ["B044"], keywords: ["проект", "управлен", "менедж", "it-проект"] },
          { id: "product_manager", name: "Продакт-менеджер", bCodes: ["B044"], keywords: ["продукт", "менедж", "развитие"] },
          { id: "hr_director", name: "HR-директор", bCodes: ["B044"], keywords: ["персонал", "кадр", "hr", "рекрут"] },
          { id: "business_consult", name: "Бизнес-консультант", bCodes: ["B044"], keywords: ["консалтинг", "бизнес-модел", "развитие"] }
        ]
      },
      {
        id: "marketing",
        name: "Маркетинг и реклама",
        professions: [
          { id: "marketer", name: "Маркетолог", bCodes: ["B047"], keywords: ["маркетинг", "рынок", "продвижен"] },
          { id: "target_spec", name: "Таргетолог / Трафик-менеджер", bCodes: ["B047"], keywords: ["реклама", "конверс", "таргет"] },
          { id: "smm_spec", name: "SMM-специалист", bCodes: ["B047"], keywords: ["соц", "медиа", "smm", "контент"] },
          { id: "brand_manager", name: "Бренд-менеджер", bCodes: ["B047"], keywords: ["бренд", "имидж", "маркетинг"] },
          { id: "pr_specialist", name: "PR-специалист", bCodes: ["B047"], keywords: ["связи", "обществен", "pr", "паблик"] }
        ]
      }
    ]
  },
  {
    id: "law_and_gov",
    name: "Юриспруденция и Госструктуры",
    icon: "⚖️",
    subcategories: [
      {
        id: "law",
        name: "Юриспруденция",
        professions: [
          { id: "advocate", name: "Адвокат", bCodes: ["B049"], keywords: ["юрист", "защитник", "право", "суд", "уголовн"] },
          { id: "prosecutor", name: "Прокурор", bCodes: ["B049"], keywords: ["прокур", "государствен", "право", "суд"] },
          { id: "judge", name: "Судья", bCodes: ["B049"], keywords: ["суд", "правосудие", "судья"] },
          { id: "corp_lawyer", name: "Корпоративный юрист", bCodes: ["B049"], keywords: ["корпоратив", "юрисконс", "бизнес", "коммерческ", "право"] },
          { id: "notary", name: "Нотариус", bCodes: ["B049"], keywords: ["нотариус", "сделк", "заверен"] }
        ]
      },
      {
        id: "gov",
        name: "Государственное управление",
        professions: [
          { id: "gov_manager", name: "Государственный служащий", bCodes: ["B044", "B049"], keywords: ["государствен", "управлен", "муницип", "акимат"] },
          { id: "diplomat", name: "Дипломат / Атташе", bCodes: ["B031"], keywords: ["международн", "отношен", "дипломат", "консул"] }
        ]
      }
    ]
  },
  {
    id: "engineering",
    name: "Инженерия, Техника и Робототехника",
    icon: "⚙️",
    subcategories: [
      {
        id: "robotics_auto",
        name: "Робототехника и Автоматизация",
        professions: [
          { id: "robotics_eng", name: "Конструктор роботов", bCodes: ["B063", "B057"], keywords: ["робототех", "мехатроник", "робот", "сенсор"] },
          { id: "uav_dev", name: "Разработчик беспилотных систем", bCodes: ["B063", "B067"], keywords: ["беспилот", "дрон", "квадрокоптер", "робот"] },
          { id: "auto_engineer", name: "Инженер по автоматизации / АСУТП", bCodes: ["B063"], keywords: ["автоматизац", "управлен", "контроллер", "кпи"] }
        ]
      },
      {
        id: "mech_electrical",
        name: "Механика и Электроэнергетика",
        professions: [
          { id: "mech_eng", name: "Инженер-механик", bCodes: ["B064"], keywords: ["механик", "оборудов", "станки", "машиностро"] },
          { id: "elec_eng", name: "Инженер-электрик / Энергетик", bCodes: ["B062"], keywords: ["электро", "энергет", "кабель", "станция", "электрическ"] },
          { id: "hvac_eng", name: "Инженер-конструктор систем жизнеобеспечения", bCodes: ["B062", "B064"], keywords: ["климат", "отоплен", "инженер-конструкт"] }
        ]
      }
    ]
  },
  {
    id: "architecture_build",
    name: "Архитектура и Строительство",
    icon: "🏗️",
    subcategories: [
      {
        id: "arch_design",
        name: "Архитектура и Урбанизация",
        professions: [
          { id: "architect", name: "Архитектор", bCodes: ["B073"], keywords: ["архитект", "проект", "здание", "дом"] },
          { id: "landscape_arch", name: "Ландшафтный архитектор", bCodes: ["B073"], keywords: ["ландшафт", "парк", "озеленен"] },
          { id: "urbanist", name: "Урбанист / Проектировщик городов", bCodes: ["B073", "B074"], keywords: ["урбанизм", "город", "генеральн", "план"] }
        ]
      },
      {
        id: "building",
        name: "Строительные технологии",
        professions: [
          { id: "civil_eng", name: "Инженер-строитель", bCodes: ["B074"], keywords: ["строитель", "бетон", "конструкц", "каркас"] },
          { id: "bim_manager", name: "BIM-проектировщик", bCodes: ["B073", "B074"], keywords: ["bim", "модел", "3d", "строитель", "архитект"] },
          { id: "estimator", name: "Сметчик", bCodes: ["B074", "B045"], keywords: ["смета", "стоимость", "расчет", "строитель"] },
          { id: "construction_mgr", name: "Прораб / Руководитель стройки", bCodes: ["B074"], keywords: ["прораб", "строитель", "участок", "монтаж"] }
        ]
      }
    ]
  },
  {
    id: "heavy_industry",
    name: "Нефтегаз, Геология и Горное дело",
    icon: "🌋",
    subcategories: [
      {
        id: "oil_gas",
        name: "Нефтегазовое дело",
        professions: [
          { id: "drilling_eng", name: "Инженер по бурению", bCodes: ["B071"], keywords: ["нефтегаз", "бурен", "скважин", "добыч"] },
          { id: "petroleum_geol", name: "Геолог-нефтяник", bCodes: ["B071", "B070"], keywords: ["нефть", "геолог", "пласт", "разведка"] },
          { id: "well_operator", name: "Оператор месторождения", bCodes: ["B071"], keywords: ["месторожден", "добыч", "нефтегаз"] }
        ]
      },
      {
        id: "mining_geology",
        name: "Геология и Горнодобыча",
        professions: [
          { id: "mine_geologist", name: "Инженер-геолог", bCodes: ["B070"], keywords: ["геолог", "минерал", "порода", "ископаем"] },
          { id: "mine_surveyor", name: "Маркшейдер", bCodes: ["B071", "B070"], keywords: ["маркшейд", "геодез", "карта", "шахта"] },
          { id: "mining_eng", name: "Горный инженер", bCodes: ["B071"], keywords: ["горн", "карьер", "рудник", "шахта", "комбинат"] }
        ]
      }
    ]
  },
  {
    id: "transport_logistics",
    name: "Авиация, Транспорт и Логистика",
    icon: "✈️",
    subcategories: [
      {
        id: "aviation",
        name: "Авиация и воздухоплавание",
        professions: [
          { id: "pilot", name: "Пилот гражданской авиации", bCodes: ["B067"], keywords: ["пилот", "самолет", "штурман", "воздушн", "экипаж"] },
          { id: "airplane_eng", name: "Авиаинженер / Техник", bCodes: ["B067"], keywords: ["авиаци", "двигатель", "вертолет", "самолет", "обслуживан"] },
          { id: "dispatcher", name: "Авиадиспетчер", bCodes: ["B067"], keywords: ["диспетчер", "навигац", "радар", "воздушн"] }
        ]
      },
      {
        id: "logistics_freight",
        name: "Логистика и Эксплуатация",
        professions: [
          { id: "logistician", name: "Специалист по цепям поставок / Логист", bCodes: ["B093", "B044"], keywords: ["логист", "поставк", "груз", "перевозк", "транспорт"] },
          { id: "customs_mgr", name: "Менеджер ВЭД / Таможенный декларант", bCodes: ["B044", "B093"], keywords: ["вэд", "тамож", "экспорт", "импорт"] },
          { id: "transit_operator", name: "Диспетчер транспортного терминала", bCodes: ["B093"], keywords: ["жд", "склад", "терминал", "перевозк"] }
        ]
      }
    ]
  },
  {
    id: "humanities_and_pedagogy",
    name: "Педагогика, Наука и Психология",
    icon: "🏫",
    subcategories: [
      {
        id: "pedagogy",
        name: "Педагогика и образование",
        professions: [
          { id: "primary_teacher", name: "Учитель начальных классов", bCodes: ["B001", "B003"], keywords: ["начальн", "учитель", "педагог", "школа"] },
          { id: "subject_teacher", name: "Учитель-предметник (Математика, Язык и др.)", bCodes: ["B015", "B016", "B017"], keywords: ["подготовк", "учител", "казахск", "русск", "физик", "химик", "педагог"] },
          { id: "tutor", name: "Воспитатель детского сада", bCodes: ["B003"], keywords: ["дошкольн", "детск", "сад", "воспит"] }
        ]
      },
      {
        id: "science",
        name: "Фундаментальная наука",
        professions: [
          { id: "mathematician", name: "Математик-исследователь", bCodes: ["B055"], keywords: ["математик", "статистик", "исследов"] },
          { id: "physicist", name: "Физик", bCodes: ["B054"], keywords: ["физик", "лаборант", "квантов"] },
          { id: "chemist", name: "Химик-аналитик", bCodes: ["B053"], keywords: ["химик", "лабор", "аппарат", "реагент"] },
          { id: "biologist", name: "Биолог-генетик", bCodes: ["B050"], keywords: ["биолог", "микробиол", "генети", "клетк"] },
          { id: "ecologist", name: "Эколог", bCodes: ["B051"], keywords: ["эколог", "окружающ", "среда", "вредн", "выброс"] }
        ]
      },
      {
        id: "psychology",
        name: "Психология",
        professions: [
          { id: "clinical_psych", name: "Клинический психолог", bCodes: ["B041"], keywords: ["психолог", "терапия", "патолог", "клинич"] },
          { id: "hr_psych", name: "Корпоративный психолог / HR-консультант", bCodes: ["B041", "B044"], keywords: ["психолог", "персонал", "тренинг", "коллектив"] },
          { id: "family_psych", name: "Семейный консультант", bCodes: ["B041"], keywords: ["семейн", "психолог", "отношен", "брак"] }
        ]
      }
    ]
  },
  {
    id: "media_art",
    name: "Искусство, Медиа, Кино и Туризм",
    icon: "🎨",
    subcategories: [
      {
        id: "journal_cinema",
        name: "Журналистика и Кинематограф",
        professions: [
          { id: "reporter", name: "Репортер / Журналист", bCodes: ["B036"], keywords: ["журнал", "сми", "статья", "эфир", "репорт"] },
          { id: "tv_host", name: "Телеведущий / Диктор", bCodes: ["B036", "B027"], keywords: ["телевиден", "ведущ", "радио", "диктор"] },
          { id: "editor", name: "Редактор", bCodes: ["B036"], keywords: ["редакт", "текст", "издател"] },
          { id: "copywriter", name: "Копирайтер / Сценарист", bCodes: ["B036", "B027"], keywords: ["копирайт", "сценар", "креатив", "автор"] },
          { id: "director", name: "Кинорежиссер / Клипмейкер", bCodes: ["B027"], keywords: ["режиссер", "кино", "постановк", "фильм"] },
          { id: "camera_operator", name: "Оператор / Видеограф", bCodes: ["B027"], keywords: ["оператор", "камера", "съемк", "видео"] },
          { id: "actor", name: "Актер театра и кино", bCodes: ["B027"], keywords: ["актер", "театр", "драма", "роль"] }
        ]
      },
      {
        id: "music_sculpt",
        name: "Музыка и Изобразительное искусство",
        professions: [
          { id: "composer", name: "Композитор / Аранжировщик", bCodes: ["B021"], keywords: ["композит", "музык", "аранжир"] },
          { id: "musician", name: "Исполнитель / Вокалист", bCodes: ["B021"], keywords: ["музыкант", "вокал", "скрипк", "фортеп", "певец"] },
          { id: "artist", name: "Художник / Скульптор", bCodes: ["B030"], keywords: ["худож", "живопись", "скульпт", "реставр"] }
        ]
      },
      {
        id: "tourism_hospitality",
        name: "Туризм и Сервис",
        professions: [
          { id: "tourism_agent", name: "Менеджер по туризму", bCodes: ["B093"], keywords: ["туризм", "агент", "путешеств", "тур"] },
          { id: "hotelier", name: "Отельер / Директор гостиницы", bCodes: ["B093"], keywords: ["отель", "гостиниц", "рецепшн", "гостеприим"] },
          { id: "restaurateur", name: "Ресторатор / Менеджер ресторанного дела", bCodes: ["B093"], keywords: ["ресторан", "кафе", "общепит", "кухня"] },
          { id: "guide", name: "Гид-экскурсовод", bCodes: ["B093"], keywords: ["экскурсовод", "гид", "маршрут"] }
        ]
      }
    ]
  }
];

// Helper to check what professions are taught in a specific university
export function getAvailableProfessionsForUniversity(uni: { faculties?: { specialties?: { name: string; code: string; description: string }[] }[] }): { category: string; subcategory: string; professionName: string; bCode: string; specialtyName: string }[] {
  const result: { category: string; subcategory: string; professionName: string; bCode: string; specialtyName: string }[] = [];
  const processedKeys = new Set<string>();

  const allSpecialties = uni.faculties?.flatMap(f => f.specialties || []) || [];

  for (const cat of KAZ_PROFESSION_CATEGORIES) {
    for (const sub of cat.subcategories) {
      for (const prof of sub.professions) {
        // Find matching specialty
        for (const sp of allSpecialties) {
          const spCodeClean = sp.code ? sp.code.trim().toUpperCase() : "";
          const spNameClean = sp.name ? sp.name.toLowerCase() : "";
          const spDescClean = sp.description ? sp.description.toLowerCase() : "";

          // Match by B-code
          const hasBCodeMatch = prof.bCodes.some(b => {
            const bClean = b.trim().toUpperCase();
            return spCodeClean === bClean || spCodeClean.startsWith(bClean) || bClean.startsWith(spCodeClean);
          });

          // Match by keywords if B-code matches or as fallback
          const hasKeywordMatch = prof.keywords.some(kw => {
            return spNameClean.includes(kw) || spDescClean.includes(kw);
          });

          if (hasBCodeMatch && hasKeywordMatch) {
            const resultKey = `${prof.name}-${sp.name}`;
            if (!processedKeys.has(resultKey)) {
              processedKeys.add(resultKey);
              result.push({
                category: cat.name,
                subcategory: sub.name,
                professionName: prof.name,
                bCode: sp.code,
                specialtyName: sp.name
              });
            }
          }
        }
      }
    }
  }

  // If result is empty, fallback to some matches based on names to guarantee no empty lists
  if (result.length === 0) {
    for (const cat of KAZ_PROFESSION_CATEGORIES) {
      for (const sub of cat.subcategories) {
        for (const prof of sub.professions) {
          for (const sp of allSpecialties) {
            const spNameClean = sp.name ? sp.name.toLowerCase() : "";
            const matchesKeyword = prof.keywords.some(kw => spNameClean.includes(kw));
            if (matchesKeyword) {
              const resultKey = `${prof.name}-${sp.name}`;
              if (!processedKeys.has(resultKey)) {
                processedKeys.add(resultKey);
                result.push({
                  category: cat.name,
                  subcategory: sub.name,
                  professionName: prof.name,
                  bCode: sp.code || "B000",
                  specialtyName: sp.name
                });
              }
            }
          }
        }
      }
    }
  }

  return result;
}
