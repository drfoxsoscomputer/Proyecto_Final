

const dataBulk = async(table, data)=>{
    try {
      //Verificar si ya hay datos en la base de datos, si no, entonces los incorpora
      const existingdatas = await table.findAll();
      if (existingdatas.length === 0) {
          // Hacer una lectura de la data.json para llenar la tabla
          await table.bulkCreate(data);
          console.log(`"${table.getTableName()}" table filled successfully`);
        } else {
          console.log(`The "${table.getTableName()}" table already contains data.`);
        }
      } catch (error) {
       console.error({error: error.message});
        
       }
  };

  module.exports = dataBulk;