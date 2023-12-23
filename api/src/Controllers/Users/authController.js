const { User } = require('../../database');
const bcrypt = require('bcrypt');

const authenticateAndUpdate = async (email, password, sub, additionalFields) => {
    try {
        // Verificar la autenticación por email y contraseña
        if (email && password) {
            const existingUser = await User.findOne({
                where: {
                    email: email,
                    deleteAt:false,
                },
            });

            if (existingUser) {
                const passwordMatch = await bcrypt.compare(password, existingUser.password);

                if (passwordMatch) {
                    // Autenticación exitosa por email y contraseña
                    return { isCreate: false, user: existingUser };
                } else {
                    throw new Error('Contraseña incorrecta');
                }
            }
        }

        // Verificar la autenticación por email y sub
        if (email && sub) {
            const existingUser = await User.findOne({
                where: {
                    email: email,
                    sub: sub,
                    deleteAt:false,
                },
            });
            if (existingUser && existingUser.sub === sub) {
                // Autenticación exitosa por email y sub
                return { isCreate: false, user: existingUser };
            
        
            }
        }

        // Si no hay coincidencias, crea un nuevo usuario
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const [newUser, create] = await User.findOrCreate({
            where: {
                email: email,
            },
            defaults: {
                email,
                password: hashedPassword,
                sub,
                ...additionalFields,
            },
        });

        return { isCreate: create, user: newUser };
    } catch (error) {
        console.error('¡Hubo un error!', error);
        throw error;
    }
};

module.exports = authenticateAndUpdate;
