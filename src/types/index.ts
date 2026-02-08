export interface Group {
    id: string;
    platform: string;
    groupType: string;
    college: string;
    subject: string;
    sectionNumber: string;
    groupLink: string;
    groupName: string | null;
    description: string | null;
    isActive: boolean;
    memberCount: number;
    votes: number;
    status?: string;

    // For compatibility with UI components:
    upvotes: number;
    downvotes?: number;

    // Legacy alias
    telegramLink?: string;

    createdAt: string;
    updatedAt: string;
}

export interface Faculty {
    id: string;
    name: string;
}

export interface Subject {
    id: string; // Name as ID
    name: string;
    facultyId: string; // College name as ID
}

export interface Section {
    id: string; // Section Number as ID
    sectionNumber: string;
    subjectId: string; // Subject name as ID
}
