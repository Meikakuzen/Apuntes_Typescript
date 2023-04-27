import { getStringInfo, toUpperCase } from "../app/Utils"

describe("Utils test suit", ()=>{

    it("should return uppercase of valid string", ()=>{
        //arrange
        const sut = toUpperCase;
        const expected = 'ABC'

        //act
        const actual = toUpperCase('abc')

        // assert
        expect(actual).toBe(expected)

    })

    describe('getStringInfo for arg My-String', ()=>{
        test('return right length', ()=>{
            const actual = getStringInfo('My-String')
            expect(actual.characters).toHaveLength(9)
        })
        test('return right lower case', ()=>{
            const actual = getStringInfo('My-String')
            expect(actual.lowerCase).toBe('my-string')
        })
        test('return right upper case', ()=>{
            const actual = getStringInfo('My-String')
            expect(actual.upperCase).toBe('MY-STRING')
        })
        test('return right characters', ()=>{
            const actual = getStringInfo('My-String')
            
            expect(actual.characters).toContain<string>('M')
            expect(actual.characters).toStrictEqual(['M', 'y', '-','S', 't', 'r', 'i', 'n', 'g'])
            expect(actual.characters).toEqual(
                expect.arrayContaining(['S', 't', 'r', 'i', 'n', 'g', 'M', 'y', '-'])
            )        
        })

        test('return defined extraInfo', ()=>{
            const actual = getStringInfo('My-String')
            expect(actual.extraInfo).not.toBe(undefined)
            expect(actual.extraInfo).not.toBeUndefined()
            expect(actual.extraInfo).toBeDefined()
        
        })
        test('return right extra Info', ()=>{
            const actual = getStringInfo('My-String')
        expect(actual.extraInfo).toEqual({})
        expect(actual.extraInfo).toBeTruthy()

        })

        describe.only('ToUpperCase examples', ()=>{  //uso only para testear solo esto
            it.each([
                {input: 'abc', expected: 'ABC'},
                {input: 'def', expected: 'DEF'},
                {input: 'my-String', expected: 'MY-STRING'}
            ])('$input toUpperCase should be $expected', ({input,expected})=>{
                const actual = toUpperCase(input)

                expect(actual).toBe(expected)
            })
        })

    })

    
})