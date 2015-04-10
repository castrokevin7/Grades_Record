//Importación del módulo para la conexión con MSSQL SERVER
var mssql = require('mssql');
//Configuración de la conexión con la Base de Datos
var configuration = 
{
	user: 'sa',
	password: '123',
	server: 'localhost',
	database: 'RegistroNotas'
}
var grupo;
var grupos;
function estructuraGrupo() {
	var grupo = 
	{		
		ID: 0,
		periodoID: 0,
		profesorID: 0,
		cursoID: 0,
		codigo: "",
		cupo: 0
	};
	return grupo;
}
function grupos() {
	var connection = new mssql.Connection(configuration, function (err) {
	    var request = new mssql.Request(connection);
	    request.execute('dbo.RNSP_Grupos', function (err, recordsets, returnValue) {    	
	        grupos = new Array(recordsets[0].length);
	        for (var i = 0; i < recordsets[0].length; i++) {
	        	grupo = new estructuraGrupo();
	        	grupo.ID = recordsets[0][i].ID;
	        	grupo.periodoID = recordsets[0][i].FK_PeriodoGrupo;
	        	grupo.profesorID = recordsets[0][i].FK_ProfesorGrupo;
	        	grupo.cursoID = recordsets[0][i].FK_CursoGrupo;
	        	grupo.codigo = recordsets[0][i].Codigo;
	        	grupo.cupo = recordsets[0][i].Cupo;
	        	grupos[i] = grupo;
	        };
	    });   
	});
	return grupos;
}
function insertar(periodoID, profesorID, cursoID, codigo, cupo) {
	var connection = new mssql.Connection(configuration, function (err) {
	    var request = new mssql.Request(connection);
	    //Parámetros
	    request.input('FK_Periodo', mssql.VarChar(50), periodoID);
	    request.input('FK_Profesor', mssql.VarChar(50), profesorID);
	    request.input('FK_Curso', mssql.VarChar(50), cursoID);
	    request.input('Codigo', mssql.VarChar(50), codigo);
	    request.input('Cupo', mssql.Int, cupo);
	    //Ejecución del Store Procedure
	    request.execute('dbo.RNSP_InsertarGrupo', function (err, recordsets, returnValue) { 	    	
			console.log("Ejecución efectiva del SP (INSERTAR GRUPO)");
			var respuesta = {
				resultado: returnValue
			};			
	    	return respuesta;
	    });  	    
	});
}
module.exports.grupos = grupos;
module.exports.insertar = insertar;