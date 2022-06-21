
export const Roles = {
    user: { name: 'user', code: 0},
    buddy: { name: 'buddy', code: 1},
    lord: { name: 'lord', code: 2},
    admin: { name: 'admin', code: 3},
    astek: { name: 'astek', code: 4},
    // Buddy = 'buddy',
    // Lord = 'lord',
    // Admin = 'admin',
    // Astek = 'astek',
    // some = "some"

    getCodeFromName(name: string): number{
        if(name === Roles.user.name){
            return Roles.user.code
        }

        if(name === Roles.buddy.name){
            return Roles.buddy.code
        }

        if(name === Roles.lord.name){
            return Roles.lord.code
        }

        if(name === Roles.admin.name){
            return Roles.admin.code
        }

        if(name === Roles.astek.name){
            return Roles.astek.code
        }
    }

    // getNameFromCode(code: number): string{
    //     if(code === Roles.user.code){
    //         return Roles.user.name
    //     }

    //     if(code === Roles.buddy.code){
    //         return Roles.buddy.name
    //     }

    //     if(code === Roles.lord.code){
    //         return Roles.lord.name
    //     }

    //     if(code === Roles.admin.code){
    //         return Roles.admin.name
    //     }

    //     if(code === Roles.astek.code){
    //         return Roles.astek.name
    //     }
    // }
}