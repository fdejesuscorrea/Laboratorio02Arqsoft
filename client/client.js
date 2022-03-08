let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
let readline = require("readline");
const REMOTE_SERVER = '0.0.0.0:50050';


let employees = [
    {
        employee_id: 1,
        name: 'felipe de jesus correa londoño',
       accrued_leave_days:15,
        requested_leave_days: 0
    },
    {
        employee_id: 2,
         name: 'carlitos zapata',
       accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 3,
         name: 'juan david',
       accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 4,
         name:'carlos quiros',
       accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 5,
         name:'david lopez',
       accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 6,
         name:'ernesto guevara',
       accrued_leave_days: 15,
        requested_leave_days: 0
    },
    {
        employee_id: 7,
         name:'Toño Gramsci',
       accrued_leave_days: 15,
        requested_leave_days: 0
    }
    
];


 //Read terminal Lines
 let reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });
    
//Load the protobuf
 
 let load=  protoLoader.loadSync("../proto/vacaciones.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
    });

    let proto= grpc.loadPackageDefinition(load);


//Create gRPC client
let client = new proto.work_leave.EmployeeLeaveDaysService(
REMOTE_SERVER,
grpc.credentials.createInsecure()
);
// Preguntar al usuario por sus datos de empleado
function dataEmployee() {
    reader.question("Ingres id empleado: ", id => { 
        reader.question("Ingrese el numero de días que solicita: ", num =>{
            let employee= employees.find( function(element){
                return element.employee_id == id;
            });
            employee.requested_leave_days= parseFloat(num);
            startStream(employee);
        })
  });
}



let startStream = (employee) => {
   
    client.elegibleForLeave(employee, (err,callback) => {
        if(!err){
            if(callback.elegible){
                client.grantLeave(employee,(err,grant)=> {
                      console.log(grant);
                })
            } else{
                console.log(" Supera el limite de horas, permiso denegado");
            }
        }else{
            console.log(err.details);
        }
    });
    getDecision();
}

function getDecision(){
    reader.question("Desea continuar? SI/NO", decision =>{
            if(decision.toLowerCase()== "si"){
                dataEmployee();
            }else if(decision.toLowerCase()== "no"){
               console.log(" Oprima CTRL+C para salir");
            }
            else{
                console.log(" Repsuesta incorrecta  Oprima CTRL+C para salir y volver a intentar ");
            }
             
    });
}
dataEmployee();
   
 
