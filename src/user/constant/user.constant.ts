export const USER_API_ENTRY_POINT = {
    BASE: '/user',
    CREATE_ORGANIZER: 'create/organizer',
    PROMOTE_TO_ORGANIZER: 'promote/organizer',
}

export const USER_SORT = {
    CREATED_AT: 'createdAt',
    EMAIL: 'email',
    NAME: 'name',
    ROLE: 'role',
} as const;

export const ALLOWED_USER_SORT_FIELDS = Object.values(USER_SORT);

export type UserSortField = typeof USER_SORT[keyof typeof USER_SORT];