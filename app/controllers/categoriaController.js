const {Categoria} = require("../models/Categoria");

const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    if (categorias.length === 0) {
      return res.status(204).json({ msg: "No se encontraron categorías" });
    }

    const categoriasData = categorias.map(categoria => categoria.get());
    return res.json(categoriasData);

  } catch (err) {
    console.error("Error al traer categorías:", err);
    return res.status(500).json({ msg: "Error al traer todas las categorías" });
  }
};


function funciona(req,res){
  res.json({msg:"HOla"})
}

module.exports = {obtenerCategorias, funciona}
