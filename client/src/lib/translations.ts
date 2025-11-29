export type Language = "az" | "en" | "ru";

export const translations = {
  az: {
    // Navigation
    nav: {
      dashboard: "İdarəetmə Paneli",
      report: "Aylıq Hesabat",
      goals: "Məqsədlər",
      race: "Qənaət Yarışı",
      finny: "Finny Məsləhətçi",
      education: "Maarifləndirmə",
      profile: "Profil",
      logout: "Çıxış",
      login: "Daxil ol",
    },
    // Dashboard
    dashboard: {
      title: "İdarəetmə Paneli",
      thisMonthIncome: "Bu ayın gəliri",
      thisMonthExpense: "Bu ayın xərci",
      savings: "Kənara qoyulan",
      transactions: "Əməliyyatlar",
      addIncome: "Gəlir əlavə et",
      addExpense: "Xərc əlavə et",
      noTransactions: "Hələ əməliyyat yoxdur",
      date: "Tarix",
      category: "Kateqoriya",
      amount: "Məbləğ",
      type: "Növ",
      actions: "Əməliyyatlar",
      income: "Gəlir",
      expense: "Xərc",
      edit: "Redaktə et",
      delete: "Sil",
      yourGoals: "Məqsədləriniz",
      viewAll: "Hamısına bax",
    },
    // Transaction categories
    categories: {
      food: "Ərzaq",
      transport: "Nəqliyyat",
      entertainment: "Əyləncə",
      utilities: "Kommunal",
      shopping: "Alış-veriş",
      health: "Sağlamlıq",
      education: "Təhsil",
      other: "Digər",
      salary: "Maaş",
      freelance: "Frilans",
      investment: "İnvestisiya",
      gift: "Hədiyyə",
      other_income: "Digər gəlir",
    },
    // Monthly Report
    report: {
      title: "Aylıq Hesabat",
      totalIncome: "Ümumi Gəlir",
      totalExpense: "Ümumi Xərc",
      totalSavings: "Ümumi Qənaət",
      comparison: "Müqayisə",
      comparedToRegion: "bölgə ortalaması ilə müqayisədə",
      comparedToAge: "yaş qrupu ortalaması ilə müqayisədə",
      moreSpent: "çox xərc etmisiniz",
      lessSpent: "az xərc etmisiniz",
      finnyAdvice: "Finny Məsləhəti",
      selectMonth: "Ay seçin",
    },
    // Goals
    goals: {
      title: "Məqsədlər",
      createGoal: "Yeni Məqsəd",
      goalName: "Məqsəd adı",
      targetAmount: "Hədəf məbləği",
      deadline: "Son tarix",
      addSavings: "Qənaət əlavə et",
      progress: "İrəliləyiş",
      noGoals: "Hələ məqsəd yoxdur",
      create: "Yarat",
      cancel: "Ləğv et",
      completed: "Tamamlandı",
      remaining: "Qalıb",
    },
    // Savings Race
    race: {
      title: "Dostlarla Qənaət Yarışı",
      addFriend: "Dost əlavə et",
      friendEmail: "Dostun Gmail ünvanı",
      sendRequest: "Dəvət göndər",
      pendingRequests: "Gözləyən dəvətlər",
      accept: "Qəbul et",
      reject: "Rədd et",
      leaderboard: "Lider lövhəsi",
      noFriends: "Hələ dostunuz yoxdur",
      rank: "Sıra",
      username: "İstifadəçi",
      goal: "Məqsəd",
      completion: "Tamamlanma",
      thisMonth: "Bu ay",
    },
    // Finny AI
    finny: {
      title: "Finny - Maliyyə Məsləhətçiniz",
      subtitle: "Şəxsi maliyyə məsləhətləri alın",
      getAdvice: "Məsləhət al",
      thinking: "Finny düşünür...",
      placeholder: "Sualınızı yazın...",
      recentAdvice: "Son Məsləhətlər",
    },
    // Education
    education: {
      title: "Maliyyə Maarifləndirmə",
      credit: {
        title: "Kredit nədir?",
        content: `Kredit - bankın və ya maliyyə təşkilatının müəyyən şərtlərlə sizə verdiyi borc puldur.

Kredit növləri:
• İstehlak krediti - şəxsi ehtiyaclar üçün
• İpoteka krediti - mənzil almaq üçün
• Avtokredit - avtomobil almaq üçün
• Təhsil krediti - təhsil xərclərini ödəmək üçün

Kredit götürməzdən əvvəl:
1. Faiz dərəcəsini müqayisə edin
2. Aylıq ödənişin gəlirinizin 30%-ni keçməməsinə diqqət edin
3. Müqaviləni diqqətlə oxuyun
4. Gizli komissiyalara fikir verin`,
      },
      mortgage: {
        title: "İpoteka necə işləyir?",
        content: `İpoteka - uzunmüddətli mənzil krediti olub, aldığınız mənzil bank üçün girov rolunu oynayır.

İpoteka prosesi:
1. İlkin ödəniş - adətən mənzil dəyərinin 10-30%-i
2. Müddət - 5 ildən 30 ilə qədər
3. Faiz dərəcəsi - sabit və ya üzən ola bilər
4. Aylıq ödənişlər - əsas borc + faiz

Vacib məqamlar:
• İlkin ödəniş nə qədər çox olsa, ümumi ödəniş az olar
• Faiz dərəcəsi hər bankda fərqli ola bilər
• Sığorta və qiymətləndirmə xərcləri də olacaq
• Vaxtından əvvəl ödəmə cərimələrini öyrənin`,
      },
      fraud: {
        title: "Dələduzlara qarşı müdafiə qaydaları",
        content: `Maliyyə dələduzluğundan qorunmaq üçün:

SMS və zəng dələduzluğu:
• Bank heç vaxt SMS ilə şifrə istəmir
• Naməlum linkləri açmayın
• Kart məlumatlarını telefonda verməyin

Onlayn təhlükəsizlik:
• Güclü şifrələr istifadə edin
• İki faktorlu autentifikasiya aktivləşdirin
• Rəsmi bank tətbiqlərindən istifadə edin
• İctimai Wi-Fi-da bank əməliyyatları etməyin

Əgər dələduzluğa məruz qaldınızsa:
1. Dərhal bankı xəbərdar edin
2. Kartı bloklayın
3. Polisə müraciət edin
4. Bütün əməliyyatları sənədləşdirin`,
      },
    },
    // Profile
    profile: {
      title: "Profil",
      settings: "Parametrlər",
      fullName: "Ad və Soyad",
      age: "Yaş",
      region: "Bölgə",
      gender: "Cins",
      email: "E-poçt",
      registrationDate: "Qeydiyyat tarixi",
      language: "Dil",
      edit: "Redaktə et",
      save: "Yadda saxla",
      cancel: "Ləğv et",
      male: "Kişi",
      female: "Qadın",
      other: "Digər",
      prefer_not_to_say: "Demək istəmirəm",
    },
    // Auth
    auth: {
      welcome: "FinEdu AZ-a Xoş Gəlmisiniz",
      subtitle: "Maliyyə savadlılığınızı artırın",
      loginWithGoogle: "Google ilə daxil olun",
      completeProfile: "Profilinizi tamamlayın",
      fullName: "Ad və Soyad",
      age: "Yaş",
      region: "Bölgə",
      gender: "Cins (ixtiyari)",
      continue: "Davam et",
    },
    // Common
    common: {
      loading: "Yüklənir...",
      error: "Xəta baş verdi",
      success: "Uğurlu!",
      azn: "AZN",
      save: "Yadda saxla",
      cancel: "Ləğv et",
      delete: "Sil",
      edit: "Redaktə et",
      add: "Əlavə et",
      close: "Bağla",
      confirm: "Təsdiq et",
      description: "Təsvir",
    },
  },
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      report: "Monthly Report",
      goals: "Goals",
      race: "Savings Race",
      finny: "Finny Advisor",
      education: "Education",
      profile: "Profile",
      logout: "Logout",
      login: "Login",
    },
    // Dashboard
    dashboard: {
      title: "Dashboard",
      thisMonthIncome: "This Month's Income",
      thisMonthExpense: "This Month's Expenses",
      savings: "Savings",
      transactions: "Transactions",
      addIncome: "Add Income",
      addExpense: "Add Expense",
      noTransactions: "No transactions yet",
      date: "Date",
      category: "Category",
      amount: "Amount",
      type: "Type",
      actions: "Actions",
      income: "Income",
      expense: "Expense",
      edit: "Edit",
      delete: "Delete",
      yourGoals: "Your Goals",
      viewAll: "View All",
    },
    // Transaction categories
    categories: {
      food: "Food",
      transport: "Transport",
      entertainment: "Entertainment",
      utilities: "Utilities",
      shopping: "Shopping",
      health: "Health",
      education: "Education",
      other: "Other",
      salary: "Salary",
      freelance: "Freelance",
      investment: "Investment",
      gift: "Gift",
      other_income: "Other Income",
    },
    // Monthly Report
    report: {
      title: "Monthly Report",
      totalIncome: "Total Income",
      totalExpense: "Total Expenses",
      totalSavings: "Total Savings",
      comparison: "Comparison",
      comparedToRegion: "compared to regional average",
      comparedToAge: "compared to age group average",
      moreSpent: "more spent",
      lessSpent: "less spent",
      finnyAdvice: "Finny's Advice",
      selectMonth: "Select Month",
    },
    // Goals
    goals: {
      title: "Goals",
      createGoal: "Create Goal",
      goalName: "Goal Name",
      targetAmount: "Target Amount",
      deadline: "Deadline",
      addSavings: "Add Savings",
      progress: "Progress",
      noGoals: "No goals yet",
      create: "Create",
      cancel: "Cancel",
      completed: "Completed",
      remaining: "Remaining",
    },
    // Savings Race
    race: {
      title: "Savings Race with Friends",
      addFriend: "Add Friend",
      friendEmail: "Friend's Gmail",
      sendRequest: "Send Request",
      pendingRequests: "Pending Requests",
      accept: "Accept",
      reject: "Reject",
      leaderboard: "Leaderboard",
      noFriends: "No friends yet",
      rank: "Rank",
      username: "User",
      goal: "Goal",
      completion: "Completion",
      thisMonth: "This Month",
    },
    // Finny AI
    finny: {
      title: "Finny - Your Financial Advisor",
      subtitle: "Get personalized financial advice",
      getAdvice: "Get Advice",
      thinking: "Finny is thinking...",
      placeholder: "Ask your question...",
      recentAdvice: "Recent Advice",
    },
    // Education
    education: {
      title: "Financial Education",
      credit: {
        title: "What is Credit?",
        content: `Credit is money borrowed from a bank or financial institution under certain conditions.

Types of Credit:
• Consumer credit - for personal needs
• Mortgage - for buying property
• Auto loan - for buying a car
• Student loan - for education expenses

Before taking credit:
1. Compare interest rates
2. Ensure monthly payment doesn't exceed 30% of income
3. Read the contract carefully
4. Watch for hidden fees`,
      },
      mortgage: {
        title: "How Does a Mortgage Work?",
        content: `A mortgage is a long-term housing loan where the property serves as collateral.

Mortgage Process:
1. Down payment - usually 10-30% of property value
2. Term - 5 to 30 years
3. Interest rate - fixed or variable
4. Monthly payments - principal + interest

Important Points:
• Higher down payment means lower total cost
• Interest rates vary by bank
• Insurance and appraisal costs apply
• Learn about prepayment penalties`,
      },
      fraud: {
        title: "Protection Against Fraud",
        content: `Protect yourself from financial fraud:

SMS and Phone Fraud:
• Banks never ask for PINs via SMS
• Don't open unknown links
• Never share card details over phone

Online Security:
• Use strong passwords
• Enable two-factor authentication
• Use official banking apps
• Avoid banking on public Wi-Fi

If you've been defrauded:
1. Contact your bank immediately
2. Block your card
3. Report to police
4. Document all transactions`,
      },
    },
    // Profile
    profile: {
      title: "Profile",
      settings: "Settings",
      fullName: "Full Name",
      age: "Age",
      region: "Region",
      gender: "Gender",
      email: "Email",
      registrationDate: "Registration Date",
      language: "Language",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      male: "Male",
      female: "Female",
      other: "Other",
      prefer_not_to_say: "Prefer not to say",
    },
    // Auth
    auth: {
      welcome: "Welcome to FinEdu AZ",
      subtitle: "Improve your financial literacy",
      loginWithGoogle: "Login with Google",
      completeProfile: "Complete Your Profile",
      fullName: "Full Name",
      age: "Age",
      region: "Region",
      gender: "Gender (optional)",
      continue: "Continue",
    },
    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success!",
      azn: "AZN",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      close: "Close",
      confirm: "Confirm",
      description: "Description",
    },
  },
  ru: {
    // Navigation
    nav: {
      dashboard: "Панель управления",
      report: "Месячный отчёт",
      goals: "Цели",
      race: "Гонка сбережений",
      finny: "Советник Finny",
      education: "Образование",
      profile: "Профиль",
      logout: "Выйти",
      login: "Войти",
    },
    // Dashboard
    dashboard: {
      title: "Панель управления",
      thisMonthIncome: "Доход за этот месяц",
      thisMonthExpense: "Расходы за этот месяц",
      savings: "Сбережения",
      transactions: "Транзакции",
      addIncome: "Добавить доход",
      addExpense: "Добавить расход",
      noTransactions: "Транзакций пока нет",
      date: "Дата",
      category: "Категория",
      amount: "Сумма",
      type: "Тип",
      actions: "Действия",
      income: "Доход",
      expense: "Расход",
      edit: "Редактировать",
      delete: "Удалить",
      yourGoals: "Ваши цели",
      viewAll: "Посмотреть все",
    },
    // Transaction categories
    categories: {
      food: "Еда",
      transport: "Транспорт",
      entertainment: "Развлечения",
      utilities: "Коммунальные услуги",
      shopping: "Покупки",
      health: "Здоровье",
      education: "Образование",
      other: "Другое",
      salary: "Зарплата",
      freelance: "Фриланс",
      investment: "Инвестиции",
      gift: "Подарок",
      other_income: "Другой доход",
    },
    // Monthly Report
    report: {
      title: "Месячный отчёт",
      totalIncome: "Общий доход",
      totalExpense: "Общие расходы",
      totalSavings: "Общие сбережения",
      comparison: "Сравнение",
      comparedToRegion: "по сравнению со средним по региону",
      comparedToAge: "по сравнению со средним по возрастной группе",
      moreSpent: "больше потрачено",
      lessSpent: "меньше потрачено",
      finnyAdvice: "Совет от Finny",
      selectMonth: "Выбрать месяц",
    },
    // Goals
    goals: {
      title: "Цели",
      createGoal: "Создать цель",
      goalName: "Название цели",
      targetAmount: "Целевая сумма",
      deadline: "Срок",
      addSavings: "Добавить сбережения",
      progress: "Прогресс",
      noGoals: "Целей пока нет",
      create: "Создать",
      cancel: "Отмена",
      completed: "Завершено",
      remaining: "Осталось",
    },
    // Savings Race
    race: {
      title: "Гонка сбережений с друзьями",
      addFriend: "Добавить друга",
      friendEmail: "Gmail друга",
      sendRequest: "Отправить запрос",
      pendingRequests: "Ожидающие запросы",
      accept: "Принять",
      reject: "Отклонить",
      leaderboard: "Таблица лидеров",
      noFriends: "Друзей пока нет",
      rank: "Место",
      username: "Пользователь",
      goal: "Цель",
      completion: "Выполнение",
      thisMonth: "В этом месяце",
    },
    // Finny AI
    finny: {
      title: "Finny - Ваш финансовый советник",
      subtitle: "Получите персонализированные финансовые советы",
      getAdvice: "Получить совет",
      thinking: "Finny думает...",
      placeholder: "Задайте свой вопрос...",
      recentAdvice: "Последние советы",
    },
    // Education
    education: {
      title: "Финансовое образование",
      credit: {
        title: "Что такое кредит?",
        content: `Кредит — это деньги, взятые в долг у банка или финансовой организации на определённых условиях.

Виды кредитов:
• Потребительский кредит — для личных нужд
• Ипотека — для покупки недвижимости
• Автокредит — для покупки автомобиля
• Образовательный кредит — для оплаты обучения

Перед взятием кредита:
1. Сравните процентные ставки
2. Убедитесь, что платёж не превышает 30% дохода
3. Внимательно прочитайте договор
4. Обратите внимание на скрытые комиссии`,
      },
      mortgage: {
        title: "Как работает ипотека?",
        content: `Ипотека — это долгосрочный жилищный кредит, где приобретаемая недвижимость служит залогом.

Процесс ипотеки:
1. Первоначальный взнос — обычно 10-30% стоимости
2. Срок — от 5 до 30 лет
3. Процентная ставка — фиксированная или плавающая
4. Ежемесячные платежи — основной долг + проценты

Важные моменты:
• Чем больше первоначальный взнос, тем меньше общая переплата
• Ставки различаются в разных банках
• Учтите расходы на страхование и оценку
• Узнайте о штрафах за досрочное погашение`,
      },
      fraud: {
        title: "Защита от мошенников",
        content: `Защитите себя от финансового мошенничества:

SMS и телефонное мошенничество:
• Банки никогда не просят PIN-код по SMS
• Не открывайте неизвестные ссылки
• Не сообщайте данные карты по телефону

Онлайн-безопасность:
• Используйте надёжные пароли
• Включите двухфакторную аутентификацию
• Используйте официальные банковские приложения
• Избегайте банковских операций в публичных Wi-Fi

Если вас обманули:
1. Немедленно свяжитесь с банком
2. Заблокируйте карту
3. Обратитесь в полицию
4. Задокументируйте все операции`,
      },
    },
    // Profile
    profile: {
      title: "Профиль",
      settings: "Настройки",
      fullName: "Полное имя",
      age: "Возраст",
      region: "Регион",
      gender: "Пол",
      email: "Электронная почта",
      registrationDate: "Дата регистрации",
      language: "Язык",
      edit: "Редактировать",
      save: "Сохранить",
      cancel: "Отмена",
      male: "Мужской",
      female: "Женский",
      other: "Другой",
      prefer_not_to_say: "Не хочу указывать",
    },
    // Auth
    auth: {
      welcome: "Добро пожаловать в FinEdu AZ",
      subtitle: "Повышайте свою финансовую грамотность",
      loginWithGoogle: "Войти через Google",
      completeProfile: "Заполните свой профиль",
      fullName: "Полное имя",
      age: "Возраст",
      region: "Регион",
      gender: "Пол (необязательно)",
      continue: "Продолжить",
    },
    // Common
    common: {
      loading: "Загрузка...",
      error: "Произошла ошибка",
      success: "Успешно!",
      azn: "AZN",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      add: "Добавить",
      close: "Закрыть",
      confirm: "Подтвердить",
      description: "Описание",
    },
  },
} as const;

export type Translations = typeof translations.az;
