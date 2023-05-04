# Test doubles JEST TS

- Stubs
- Fakes
- Mocks
- Spies
- Mock modules

- Qué son los tests doubles?
- Algunas unidades son lentas o de dificil acceso. Por ejemplo el acceso a una DB
- Una solución es implementar un test double database que reemplazará la DB original
- Entonces los test doubles son tests en los que se reemplaza un objeto real con el proposito de hacer el test
    - Dummy: se crea pero no se usa. Se puede usar como parámetro pero no se usa
    - Fake: simplificación, toma un atajo. Por ejemplo podemos implementar un fake login service para que devuelva un ok si recibe los argumentos válidos
    - Stubs: objetos incompletos usados como argumentos
    - Spies: track information sobre cómo la unidad es llamada. 
    - Mocks: preprogramaciones con expectativas
- Mocks y Spies tienen mucho en común en Jest
- Mocks:
  - Muy usados, también debatidos
  - La manera en la que son usados influencian la escritura de tests
  - Si necesitamos usarlos mucho algo falla en nuestro código
  - Hay varios estilos: London/Chicago
-----

## 