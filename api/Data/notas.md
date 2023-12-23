# Notas

## Sobre "Guard Clauses"
[Volver (click aquí)](./infoMiddle.md#nota)

*Cuando se menciona "guard clauses" en programación, se hace referencia a un patrón de diseño que utiliza cláusulas (o condiciones) al comienzo de una función para manejar situaciones excepcionales o casos especiales de manera temprana. Estas cláusulas guardan el resto de la lógica de la función de ejecutarse si las condiciones específicas no se cumplen.*

*El propósito de las guard clauses es mejorar la claridad del código, reducir la anidación de instrucciones if y manejar casos excepcionales de manera explícita. Aquí tienes un ejemplo sencillo en JavaScript:*

```javascript
function calculateTotalPrice(quantity, price) {
  // Guard clauses
  if (quantity <= 0) {
    return 'Cantidad inválida';
  }
  if (price < 0) {
    return 'Precio inválido';
  }
  // Lógica principal
  const totalPrice = quantity * price;
  return totalPrice;
}
```
*En este ejemplo, las guard clauses están al principio de la función, y si alguna de las condiciones no se cumple, la función se interrumpe temprano y devuelve un mensaje de error. Esto ayuda a evitar que el resto de la función se ejecute en casos donde los parámetros no cumplen con las condiciones esperadas.*

*El uso de guard clauses puede hacer que el código sea más fácil de leer, mantener y entender, ya que resalta los casos especiales y condiciones límite de manera clara al principio de la función.*

[Volver (click aquí)](./infoMiddle.md#nota)
<hr>

