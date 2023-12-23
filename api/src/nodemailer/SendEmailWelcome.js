const emailContent = `
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: 'Roboto', sans-serif !important;
        }

        h1 {
            font-size: 30px !important;
        }

        h2 {
            font-size: 25px !important;
        }

        h3 {
            font-size: 18px !important;
        }

        h4 {
            font-size: 16px !important;
        }

        p,
        a {
            font-size: 15px !important;
        }

        .claseBoton {
            width: 30%;
            background-color: white;
            border: 2px solid #6b1f54;
            color: black;
            padding: 10px 15px;
            text-align: center;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            font-size: 16px;
            margin: 10px 2px;
            transition-duration: 0.4s;
            cursor: pointer;
            border-radius: 5px;
            width: auto;
        }

        .claseBoton:hover {
            background-color: #6b1f54;
            color: #ffffff;
            border-radius: 5px;
        }

        .afooter {
            color: #ffffff !important;
            text-decoration: none;
            font-size: 14px !important;
        }
    </style>
</head>

<body>
    <div style="width: 100%;">
        <div style="padding: 20px;">
            <!-- Imagen inicial -->
            <div
                style="border: 5px solid #6b1f54; padding: 10px 0px 10px 0px; width: 100%; text-align: center;color: #000000">
                <img src="https://res.cloudinary.com/dmhxl1rpc/image/upload/v1701669208/gameworld/logo.png"
                    alt="Logo GameWorld">
            </div>
            <!-- Imagen inicial -->

            <!-- Contenido principal -->
            <div
                style="color:#000000; padding: 20px 0px 5px 0px; width: 100%; text-align: center;border: 5px solid #6b1f54">
                <h1>¡Bienvenido a Game World!</h1>
                <p> Gracias por registrarte en nuestra plataforma </p>

                <!-- Gracias -->

                <p style="margin-bottom: 50px;"><i>Atentamente:</i><br>Game World</p>

                <!-- Botón -->
                <a class="claseBoton" href="#">Ir a Game World</a>
            </div>
            <!-- Contenido principal -->

            <!-- Footer -->
            <div
                style="background-color: #282828; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center; border: 5px solid #6b1f54;">
                <p style="font-size: 13px; padding: 0px 20px 0px 20px; margin: 10px;">
                    Comunícate con nosotros por los siguientes medios:<br>
                    <a class="afooter" href="mailto:gameworld.ecommerce@gmail.com">
                        Correo: gameworld.ecommerce@gmail.com
                    </a>
                    <br>

                </p>
                <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                    © 2023 Game World. Todos los derechos reservados.
                </p>
            </div>
            <!-- Footer -->



        </div>
    </div>
</body>

</html>

`;

module.exports = emailContent;