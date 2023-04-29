import { PasswordChecker, PasswordErrors } from "../../app/pass_checker/PasswordChecker"

describe('PasswordChecker test suit', ()=>{

    let sut: PasswordChecker

    beforeEach(()=>{              //de esta manera me aseguro que la instancia va a ser independiente en cada test
        sut = new PasswordChecker
    })

    it('Password with less than 8 characters will be not valid', ()=>{
        const actual = sut.checkPassword('1234aB')

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.SHORT)
    })
    it('Password with more than 8 return ok', ()=>{
        const actual = sut.checkPassword('123456Abc')
        
        expect(actual.valid).toBe(true)
        expect(actual.reasons).not.toContain(PasswordErrors.SHORT)
    })
    it('Password with no upper case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234abcd') 

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE)
    })
    it('Password with upper case letter is ok', ()=>{
        const actual = sut.checkPassword('1234ABCDd') 
        
        expect(actual.valid).toBe(true)
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPER_CASE)
    })
    it('Password with no lower case letter is invalid', ()=>{
        const actual = sut.checkPassword('1234ABCD') 

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE)
    })
    it('Password with lower case letter is ok', ()=>{
        const actual = sut.checkPassword('1234ABCd') 
        
        expect(actual.valid).toBe(true)
        expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWER_CASE)
    })

    it("Complex password is valid", ()=>{
        const actual = sut.checkPassword('123456aB')

        expect(actual.valid).toBe(true)
        expect(actual.reasons).toEqual([])
    })

    it("Admin password with no number is invalid", ()=>{
        const actual = sut.checkAdminPassword('ABCDKJHJDLHDsljdh')

        expect(actual.valid).toBe(false)
        expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER)
    })
    it("Admin password with  number is ok", ()=>{
        const actual = sut.checkAdminPassword('ABCDKJHJDLHDsljdh9')

        expect(actual.valid).toBe(true)
        expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER)
    })

})