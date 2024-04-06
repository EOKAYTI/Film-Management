$(document).ready(function(){
    
    $("#btn-login").on("click",function(){
        let username = $("#username").val();
        let password = $("#password").val();
        let alertModal = $("#alert-modal");
       
        let loginIsSuccess = false;
        let message ="";
        $.ajax({
            url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
            type: "POST",
            dataType: "xml",
            data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <soapenv:Body>
              <q0:authenticate>
                <q0:username>${username}</q0:username>
                <q0:password>${password}</q0:password>
              </q0:authenticate>
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
              docs= $(response).find("authenticateReturn").text();
              console.log(docs);
              let authenticationReturn = JSON.parse(docs);
              console.table(authenticationReturn);
              if(authenticationReturn!=null){
                console.log(authenticationReturn.status);
                if(authenticationReturn.status ==true){
                    console.log("status = true");
                    localStorage.setItem("bearerToken","Bearer "+authenticationReturn.message);
                    loginIsSuccess = true;
                    message = `Đăng nhập thành công! Tự động chuyển hướng sau 3 giây!
                    `;
                    // alert(message);
                }else{
                    message = "Tên đăng nhập hoặc mật khẩu không chính xác!";
                    // alert(message);
                }
              }
            }
          });
          $("#message-content").text(message);
          alertModal.modal("show");
          if(loginIsSuccess){
            setTimeout(function(){
              window.location.href = "index.html";
          }, 2500);
          }

    })
    
})