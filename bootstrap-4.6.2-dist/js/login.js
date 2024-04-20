var signined = false;
var urlDefault;
var loginIsSuccess = false;
function getBearerToken(){
  announce = $("#announce");
return localStorage.getItem("bearerToken");
}
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
        "Authentication":getBearerToken(),
        "CustomRequired":""
      },
      statusCode: {
        404: function() {
            // Xử lý lỗi 404 (Not Found)
            console.log("Lỗi 404 - Không tìm thấy trang");
            
        },
        401: function() {
            // Xử lý lỗi 401 (Unauthorized)
            console.log("Lỗi 401 - Không được phép truy cập");
            signined = false;
        messageReturn = "Vui lòng đăng nhập để tiếp tục!";
            
        }
    },
      success: function(response) {
          console.log(response);
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
              if(messageReturn!=""){
                alertModal.modal("show");
              }
              if(!signined){
                setTimeout(function(){
                  window.location.href = "login.html";
              }, 2500);
              }
          }
        }
      }
      
      
    });
    if(username!=null && username!=""){
        $(".username").text(username);
        $(".info-login").removeClass('d-none');
    }else{
      $(".info-login").addClass('d-none');
    }
    return signined;
}
function reload(){
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
        "Authentication":bearerToken
      },
      statusCode: {
        404: function() {
            // Xử lý lỗi 404 (Not Found)
            console.log("Lỗi 404 - Không tìm thấy trang");
        },
        401: function() {
            // Xử lý lỗi 401 (Unauthorized)
            console.log("Lỗi 401 - un-Authentication");
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
              window.location.href = sessionStorage.getItem("oldLink");
          }
        }
      }
      
      
    });
    
}



$(document).ready(function(){

    reload();
    
    $("#btn-login").on("click",function(){
      let alertModal = $("#alert-modal");
        checkLogin();
        if(signined){
          loginIsSuccess = true;
          $("#message-content").text("Vui lòng đăng xuất để đăng nhập lại!");
          alertModal.modal("show");
          
    }
        let username = $("#username").val();
        let password = $("#password").val();

        let message ="";
        if(!loginIsSuccess){
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
              "Authentication":"",
              "CustomRequired":"none"

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
                    // get role user /

                    
                }else{
                    message = "Tên đăng nhập hoặc mật khẩu không chính xác!";
                    // alert(message);
                }
              }
            }
          });
        }
          $("#message-content").text(message);
          alertModal.modal("show");
          if(loginIsSuccess){
            $.ajax({
              url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
              type: "POST",
              dataType: "xml",
              data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
              <soapenv:Body>
                <q0:getRoleFromToken>
                  <q0:data>${localStorage.getItem("bearerToken")}</q0:data>
                </q0:getRoleFromToken>
              </soapenv:Body>
            </soapenv:Envelope>`,
              contentType: "text/xml",
              async: false,
              headers: {
                "SOAPAction": "",
                "Authentication":localStorage.getItem("bearerToken"),
                "CustomRequired":"none"
  
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
                docs= $(response).find("getRoleFromTokenReturn").text();
                console.log(docs);
                let authenticationReturn = JSON.parse(docs);
                if(authenticationReturn!=null){
                  if(authenticationReturn.status ==true){
                    if(authenticationReturn.data == 1){
                      urlDefault = 'index.html';
                    }else{
                      urlDefault = 'ticket.html';
                    }
                      // alert(message);
                      // get role user /
                    
                      
                  }
                }
              }
            });
            // alert(urlDefault)
            window.location.href = urlDefault;
          //   setTimeout(function(){
             
              
          // }, 2500);
          }

    })
    
})