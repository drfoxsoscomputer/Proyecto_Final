# Implementacion de jwt en una app de React con Vite
En este caso debemos que implementar jwt (estariamos recibiendo el access token por body),
un buen comienzo seria que la funcion que recibe la response aloje el token en el localStorage: 
```javascript
const enviarInfoAlServer = async (userData) => {
     try {
        const response = await axios.post('/log/login',{
            // aquí los datos...
          });
    
          if (response.status === 201) {
            const token = response.data.token;
            localStorage.setItem('validToken', token);//Esta es la declaracion
           } if (response.data) {
            console.log(response.data)
            return response.data;
        } else {
           alert('Error al autenticar/crear usuario');}
    } catch (error) {
        alert('Error al enviar la solicitud al servidor', error);
}   
}
``` 

Luego, utilizamos a "detail" como un componente de pruebas, y alli vamos a tomar el token que se encuentra en el "almacenamiento local" (local Storage) y pasarselo junto con el id en este caso a la funcion del "useEffect" que hace el dispatch: 

```javascript
const Detail = () => {
  const dispatch = useDispatch();
  const detail = useSelector((state) => state.characterById);

  const { id } = useParams();
  const token = localStorage.getItem('validToken');

  useEffect(() => {
    dispatch(getById(id, token));
  }, [dispatch, id]);
//resto de la funcion...
}
```

Ya en las actions podemos con estos datos confeccionar el header, o bien,  hacer una funcion que lo haga y luego invocarla, algo así como un middleware, para esto en un archivo aparte al que llamamos `AxiosUtils.jsx`, escribimos:
```javascript
const setAuthHeader = (token) => {
  const config = {};
  if (token) {
    config.headers = {
      'x-access-token':`${token}`
    };
  }
  return config;
};
```
Esta función `setAuthHeader` acepta un token y retorna la configuración del encabezado directamente con el token, o un objeto vacío si no hay un token. 

Luego solo resta importarlo en las actions y declarar `setAuthHeader` como sigue:
```javascript
export const getById =(id, token)=>async(dispatch)=>{
    try {
        const response = await axios(`/api/character/${id}`,setAuthHeader(token))
        const data = response.data;
        return dispatch({
            type:SET_BY_ID,
            payload:data
        })
    } catch (error) {
        handleApiError(error);
        throw error; 
    }
}
```
Hacerlo del modo tradicional no es más que unas pocas lineas de código. 

```javascript
export const getById =(id, token)=>async(dispatch)=>{
    try {
        const response = await axios(`/api/character/${id}`,{
          headers : {
            'x-access-token' : `${token}`
          };
        });
        const data = response.data;
        return dispatch({
            type:SET_BY_ID,
            payload:data
        })
    } catch (error) {
        handleApiError(error);
        throw error; 
    }
}
```
La desventaja que tiene esto es que podemos tener algun error de sintaxis, además el código no queda tan limpio.

## Axios Interceptor:
Esta es la respuesta de nuestro amigo Chat GPT: 

_Los interceptores en Axios son una característica poderosa proporcionada por la biblioteca Axios en JavaScript, especialmente para realizar solicitudes HTTP. Axios es una biblioteca popular utilizada para hacer solicitudes HTTP en entornos de navegador y Node.js._

_Los interceptores en Axios te permiten ejecutar tu código o modificar la solicitud o respuesta antes de que se envíe la solicitud o después de que se reciba la respuesta. Esto puede ser útil para diversas tareas, como agregar encabezados de autenticación, manejar errores de manera global o transformar solicitudes y respuestas._

_Axios proporciona dos tipos de interceptores: interceptores de solicitud e interceptores de respuesta._
<hr>
De lo dicho se desprende que tambien lo podia usar para generar el header, pero bueno, en este caso lo que quermos hacer es manejar la response para que al recibir un status 401 (usuario no autorizado) cierre la sesión y envíe al usuario al login, como no tenemos un login como tal sino una página Home de visitante, vamos a proceder a enviarlo allí. 

En el caso del ejemplo solo tenemos auth0 como login y vamos a utilizar este medio, pero en otros casos este codigo se puede adaptar (este ejemplo lo estamos haciendo con una app de prueba). Hicimos un archivo llamado `AxiosInterceptor.jsx` adonde pusimos lo siguiente:


```javascript
import axios from 'axios';

const redirectToLogin = (logout) => {
  // Lógica para redirigir al usuario al inicio de sesión
  console.log('Console.log: Token expirado. Redirigiendo al inicio de sesión...');
  
    logout({ logoutParams: { returnTo: window.location.origin } });
    //localStorage.removeItem(token); //Esto en caso de que auth0 u otro servicio no limpie el storage
    window.location.reload(true);
};

const interceptor = (logout) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Acceso no autorizado, redirigir al inicio de sesión
        redirectToLogin(logout);
      }
      return Promise.reject(error);
    }
  );
};
export default interceptor;

```
Aqui tenemos dos funciones `ìnterceptor` y `redirectToLogin` la primera intercepta la response 401 o cualquier otro error y la segunda es la encargada de redireccionarme al login. Adentro de esta última, la funcion `logout` es la funcion específica de auth0 encargada de cerrar sesión. La  declaracion `window.location.reload(true);` es secundaria, pero en caso de tener un login normal con user y pass sería principal, ya que recarga la página.

La implementacion la llevamos a cabo en el componente App, ya que se me recomendaba que fuera en un componente principal, aquí el código:

```javascript
import {Landing, Detail }from './views/index';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import interceptor from './utils/AxiosInterceptor';

function App() {
  const { logout } = useAuth0();

  useEffect(() => {
    // Configurar el interceptor cuando el componente se monta
    interceptor(logout);
  }, []);
 

  return (
    //resto del componente...
)}
```
Esto lo hicimos para el hook de auth0 ya que no podemos manejar un hook fuera del contexto de un componente funcional. 
