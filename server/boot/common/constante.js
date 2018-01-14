module.exports = {
    REGISTRO: "select public$set_usuario($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
    PAIS: "select id_pais, nombre from public$get_pais()",
    LOGIN: "select public$get_login($1,$2) AS Respuesta"
}