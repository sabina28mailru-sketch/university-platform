export interface Specialty {
  name: string;
  code: string;
  description: string;
  tuitionFee?: number;         // Годовая стоимость этой программы
  collegeTransferFee?: number; // Стоимость для поступающих после колледжа
  entMinScore?: number;        // Мин. балл ЕНТ для данной специальности
  duration?: string;           // Срок обучения: "4 года", "5 лет" и т.д.
  hasGrant?: boolean;          // Наличие грантовых мест
  grantPlaces?: number;        // Кол-во грантовых мест
}

export interface Faculty {
  name: string;
  description: string;
  specialties: Specialty[];
}

export interface University {
  id: string;
  name: string;
  address: string;
  contacts: string;
  entMinSchool: number; // Минимальный балл ЕНТ после школы
  entMinCollege: number; // Минимальный балл ЕНТ после колледжа
  hasHostel: boolean;
  hostelDetails: string;
  languages: string[]; // ["kaz", "rus", "eng"]
  hasGrants: boolean;
  hasQuotas: boolean;
  tuitionFee: number; // Стоимость обучения в год в тенге
  deadlines: string; // Дедлайны подачи документов
  faculties: Faculty[];
  imageUrl?: string; // Реальная фотография здания или кампуса
  description: string; // Презентационное описание вуза
}

export interface CareerProfession {
  id: string;
  name: string;
  iconName: string; // lucide icon name
  essence: string; // Суть профессии
  socialSignificance: string; // Социальная значимость
  directions: { name: string; description: string }[]; // Узкие направления
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  profession: string;
  budget: string;
  createdAt: string;
  status: 'new' | 'processed';
}

export interface User {
  id: string;
  username: string;
  passwordHash?: string; // Простое хэширование/пароль для демонстрации
  entScore: number;
  isCollegeGraduate: boolean; // Окончил ли колледж
  budget: number; // Допустимый годовой бюджет
  interests: string[]; // Интересующие сферы
  fullName?: string;
  phone?: string;
  email?: string;
}

export interface DynamicBlocks {
  whyUs: {
    title: string;
    subtitle: string;
    cards: { id: string; title: string; desc: string }[];
  };
  whatWeDo: {
    title: string;
    description: string;
    items: { id: string; title: string; desc: string }[];
  };
  aboutUs: {
    title: string;
    text: string;
    stats: { label: string; value: string }[];
  };
  extraSections?: {
    id: string;
    title: string;
    text: string;
    imageUrl: string;
    imagePosition: "left" | "right";
  }[];
}
