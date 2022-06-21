export const Errors = { 
    JWT_OUT_DATED:                  {code: 0, name: "JWT_OUT_DATED", message: 'Token seems outdated..' },
    INVALID_CREDENTIALS:            {code: 1, name: "INVALID_CREDENTIALS", message: 'Credentials match no entry in database..' },
    USER_UNACTIVATED:               {code: 2, name: "USER_UNACTIVATED", message: 'User is not allowed inside..' },
    NOT_ENOUGHT_RIGHT_FOR_ACTION:   {code: 3, name: "NOT_ENOUGHT_RIGHT_FOR_ACTION", message: 'Insuffisient rights for this action'},
    NOT_ENOUGHT_RIGHT_FOR_PAGE:     {code: 4, name: "NOT_ENOUGHT_RIGHT_FOR_PAGE", message:  `Vous n'avez pas les privilèges suffisent pour accéder à cette page..`},   
}