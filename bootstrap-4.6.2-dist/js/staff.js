var bearerToken;
var signined;
var username;
var messageReturn;
var bearerToken;
var signined;
function checkLogin(){
    // get token
    bearerToken = localStorage.getItem("bearerToken");
    // check login
    signined = false;
    username = null;
    messageReturn = "";
    alertModal = $("#alert-modal");
    $.ajax({
        url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
        type: "POST",
        dataType: "xml",
        data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Body>
          <q0:getUsernameFromToken>
            <q0:data>${bearerToken}</q0:data>
          </q0:getUsernameFromToken>
        </soapenv:Body>
      </soapenv:Envelope>`,
        contentType: "text/xml",
        async: false,
        headers: {
          "SOAPAction": "",
          "Authentication":""
        },
        statusCode: {
          404: function() {
              // Xử lý lỗi 404 (Not Found)
              console.log("Lỗi 404 - Không tìm thấy trang");
          },
          401: function() {
              // Xử lý lỗi 401 (Unauthorized)
              console.log("Lỗi 401 - Không được phép truy cập");
          }
      },
        success: function(response) {
        //    console.log(response);
          docs= $(response).find("getUsernameFromTokenReturn").text();
          console.log(docs);
          let docsReturn = JSON.parse(docs);
          console.table(docsReturn);
          if(docsReturn!=null){
            console.log(docsReturn.status);
            if(docsReturn.status ==true){
                console.log("status = true");
                signined = true
                username = docsReturn.data;
                // alert(message);
            }else{
                messageReturn = "Vui lòng đăng nhập để tiếp tục!";
                // alert(message);
                $("#message-content").text(messageReturn);
                alertModal.modal("show");
                if(!signined){
                  setTimeout(function(){
                    window.location.href = "login.html";
                }, 2500);
                }
            }
          }
        }
      });
}
$(document).ready(function () {
    checkLogin();
    // generate data

    $.ajax({
        url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
        type: "POST",
        dataType: "xml",
        data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Body>
          <q0:getAll/>
        </soapenv:Body>
      </soapenv:Envelope>`,
        contentType: "text/xml",
        async: false,
        headers: {
          "SOAPAction": "",
          "Authentication":""
        },
        statusCode: {
          404: function() {
              // Xử lý lỗi 404 (Not Found)
              console.log("Lỗi 404 - Không tìm thấy trang");
          },
          401: function() {
              // Xử lý lỗi 401 (Unauthorized)
              console.log("Lỗi 401 - Không được phép truy cập");
          }
      },
        success: function(response) {
        //    console.log(response);
          docs= $(response).find("getAllResponse").text();
          console.log(docs);
          let docsReturn = JSON.parse(docs);
          console.table(docsReturn);
          if(docsReturn!=null){
            console.log(docsReturn.status);
            if(docsReturn.status ==true){
                console.log("status = true");
                username = docsReturn.data;
                // alert(message);
            }else{
                messageReturn = "";
                // alert(message);
                $("#message-content").text(messageReturn);
                alertModal.modal("show");
            }
          }
        }
      });



    $('#btn_save').click(function (e) {
        let employeeID = $('#employeeID').val();
        let employeeName = $('#employeeName').val();
        let employeeRole = $('#employeeRole').val();

        // In bảng dữ liệu 
        let string = "<tr><td>" + employeeID + "</td><td>" + employeeName + "</td><td>" + employeeRole + "</td><td><button class='btn btn-primary editBtn'>Edit</button> <button class='btn btn-danger deleteBtn'>Delete</button></td></tr>";
        $('#inputtable').append(string);

        // Xử lý sự kiện click cho nút Delete
        $('.deleteBtn').click(function () {
            $(this).closest('tr').remove(); // Xóa hàng gần nhất chứa nút được click
        });

        // Xử lý sự kiện click cho nút Edit
        $('.editBtn').click(function () {
            // Thường sẽ bao gồm việc lấy dữ liệu hàng hiện tại và điền vào form để chỉnh sửa

        });


    });
});
