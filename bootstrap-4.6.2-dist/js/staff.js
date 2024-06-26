var bearerToken;
var signined;
var username;
var messageReturn;
var bearerToken;
var signined;
var isSuccess = false;
var idSelect;
var lineSelect;
var userId;
function getBearerToken(){
  return localStorage.getItem("bearerToken");
}
function authorize(){
  $.ajax({
    url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
    type: "POST",
    dataType: "xml",
    data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Body>
      <q0:getRoleFromToken>
        <q0:data>${getBearerToken()}</q0:data>
      </q0:getRoleFromToken>
    </soapenv:Body>
  </soapenv:Envelope>`,
    contentType: "text/xml",
    async: false,
    headers: {
      "SOAPAction": "",
      "Authentication":getBearerToken(),
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
          userId = authenticationReturn.data;
          if(authenticationReturn.data != 1){
            window.location.href = '403.html';
            return false;
          }else{
            sessionStorage.setItem("oldLink",window.location.href);
            return true;
          }
          
            
        }
      }
    }
  });
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

function generateData(){

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
      "Authentication":getBearerToken()
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
    //    console.log(response);
      docs= $(response).find("getAllResponse").text();
     
      let docsReturn = JSON.parse(docs);
      console.log(docsReturn);

        // console.log(docsReturn.status);
        if(docsReturn!=null){
            let tbody ="";
            docsReturn.forEach(function(element){
              
              tbody+=` <tr>
              <td>${element.id}</td>
              <td>${element.username}</td>
              <td>${element.fullName}</td>
              <td>${element.role.name}</td>
              <td><button id="${element.id}" class='btn btn-primary editBtn btn-action'>Edit</button> 
                  <button id ="${element.id}" class='btn btn-danger deleteBtn btn-action'>Delete</button>
              </td>
              </tr>
             `;
            });
            
             $("#staff-table-content").html(tbody);

            
        }else{
            messageReturn = "";
            $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
        }
      
    }
  });
  if(!signined){
    $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
    setTimeout(function(){
      window.location.href = "login.html";
  }, 2500);
  }
}
function showRoleOpt(){
  $.ajax({
    url: "http://localhost:8080/MovieTicketManagementVer3/services/RoleServiceImp",
    type: "POST",
    dataType: "xml",
    data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Body>
      <q0:getAllRole/>
    </soapenv:Body>
  </soapenv:Envelope>`,
    contentType: "text/xml",
    async: false,
    headers: {
      "SOAPAction": "",
      "Authentication":getBearerToken()
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
    //    console.log(response);
      docs= $(response).find("getAllRoleResponse").text();
     
      let docsReturn = JSON.parse(docs);
      console.log(docsReturn);

        // console.log(docsReturn.status);
        if(docsReturn!=null){
            let tbody =`<option value="">Vui lòng chọn vai trò</option>`;
            docsReturn.forEach(function(element){
              
              tbody+=`
              <option value="${element.id}">${element.name}</option>
             `;
            });
            
             $(".employee-role").html(tbody);

            
        }else{
            messageReturn = "";
            $("#message-content").text(messageReturn);
            if(messageReturn!=""){
              alertModal.modal("show");
            }
        }
      
    }
  });
  if(!signined){
    setTimeout(function(){
      window.location.href = "login.html";
  }, 0);
  }
}
$(document).ready(function () {
  if(checkLogin()){
    authorize();
  generateData();
    }
    // generate data
    // logout
    $("#logout-btn").on("click",function(){
      localStorage.setItem("bearerToken",null);
      checkLogin();
    })
    



    $('#btn_save').click(function (e) {
        let employeeName = $('#employee-name').val();
        let username = $('#username').val();
        let password = $('#password').val();
        let rePassword = $('#re-password').val();
        let employeeRole = $('#employee-role').val();
        let announce = $("#announce");
        // validating
        let isValid = false;
        let message = "";
        if(employeeName==null||employeeName=="") message ="Tên nhân viên không được rỗng!";
        else if(username==null||username=="") message ="Tên đăng nhập không được rỗng!";
        else if(password==null||password=="") message ="Mật khẩu không được rỗng!";
        else if(rePassword!=password) message ="Mật khẩu nhập lại không khớp!";
        else if(employeeRole=="") message ="Vui lòng chọn vai trò";
        else{
            isValid = true;
            message ="";
            $("#employeeManagementModal").modal('hide');

        }
        announce.text(message);
        if(isValid){
            // insert to server
            $.ajax({
              url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
              type: "POST",
              dataType: "xml",
              data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:q1="http://model" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
              <soapenv:Body>
                <q0:create>
                  <q0:model>
                    <q1:fullName>${employeeName}</q1:fullName>
                    <q1:id>0</q1:id>
                    <q1:password>${password}</q1:password>
                    <q1:role>
                      <q1:description>0</q1:description>
                      <q1:id>${employeeRole}</q1:id>
                      <q1:name>0</q1:name>
                    </q1:role>
                    <q1:username>${username}</q1:username>
                  </q0:model>
                </q0:create>
              </soapenv:Body>
            </soapenv:Envelope>`,
              contentType: "text/xml",
              async: false,
              headers: {
                "SOAPAction": "",
                "Authentication":getBearerToken()
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
                docs= $(response).find("createReturn").text();
               
                let docsReturn = JSON.parse(docs);
                console.log(docsReturn);
                
                  // console.log(docsReturn.status);
                  if(docsReturn!=null){
                      if(docsReturn.status==true){
                        isSuccess = true
                      }else{
                        messageReturn =docsReturn.message;
                      }
                  }
                
              }
            });
            if(isSuccess){
              $("#message-content").text("Tạo nhân viên thành công!");
              generateData();
              $("#create-form").trigger('reset')
            }else{
              $("#message-content").text(messageReturn);
            }
            alertModal.modal("show");
        }

        // In bảng dữ liệu 
        // let string = "<tr><td>" + employeeID + "</td><td>" + employeeName + "</td><td>" + employeeRole + "</td><td><button class='btn btn-primary editBtn'>Edit</button> <button class='btn btn-danger deleteBtn'>Delete</button></td></tr>";
        // $('#inputtable').append(string);

        // Xử lý sự kiện click cho nút Delete
       


    });

    $("#staff-table-content").on("click",'.deleteBtn',function () {
      if(checkLogin()){
        $("#confirm-delete-modal").modal("show");
        idSelect = $(this).attr("id");
        lineSelect = $(this);
      }
      
  });
    $("#confirm-delete-btn").on("click",function(){
      $("#confirm-delete-modal").modal("hide");
      let isSuccess = false;
      if(idSelect!=userId){
        messageReturn = "";
      $.ajax({
        url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
        type: "POST",
        dataType: "xml",
        data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <soapenv:Body>
          <q0:deleteById>
            <q0:id>${idSelect}</q0:id>
          </q0:deleteById>
        </soapenv:Body>
      </soapenv:Envelope>`,
        contentType: "text/xml",
        async: false,
        headers: {
          "SOAPAction": "",
          "Authentication":getBearerToken()
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
        //    console.log(response);
          docs= $(response).find("deleteByIdReturn").text();
         
          let docsReturn = JSON.parse(docs);
          console.log(docsReturn);
          
            // console.log(docsReturn.status);
            if(docsReturn!=null){
                if(docsReturn.status==true){
                  isSuccess = true
                  
                }
            }
          
        }
      });
      if(!signined){
        setTimeout(function(){
          window.location.href = "login.html";
      }, 0);
      }
      if(isSuccess){
       messageReturn = "Xóa thành công!";
       lineSelect.closest('tr').remove(); // Xóa hàng gần nhất chứa nút được click
                
      }else{
        messageReturn = "Xóa thất bại, Nhân viên không tồn tại!";
        generateData();
      }
      $("#message-content").text(messageReturn);
                if(messageReturn!=""){
                  alertModal.modal("show");
         }
      }else{
        messageReturn ="Bạn không thể xóa tài khoản của chính bạn.";
        $("#message-content").text(messageReturn);
                if(messageReturn!=""){
                  alertModal.modal("show");
         }
      }
      
      //
    })

  // Xử lý sự kiện click cho nút Edit
  var idEdit ;
  $("#staff-table-content").on("click",".editBtn",function () {
    checkLogin();
    idEdit = $(this).attr("id");
    console.log(idEdit)
    showRoleOpt();
    $("#modifyEmployeeModal").modal('show');
      // Thường sẽ bao gồm việc lấy dữ liệu hàng hiện tại và điền vào form để chỉnh sửa
  });

  $("#btn_save-edit").on('click',function(){
    let message = "";
     let employeeNameEdit = $("#employee-edit-name").val();
     let employeeRoleEdit = $("#employee-edit-role").val();
     if(employeeNameEdit=="") message = "Tên nhân viên không được rỗng!";
     else if(employeeRoleEdit=="") message= "Vui lòng chọn vai trò";
      $("#announce-edit").text(message);
      if(message==""){
        // valid
        $("#modifyEmployeeModal").modal('hide');
        $.ajax({
          url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
          type: "POST",
          dataType: "xml",
          data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:q1="http://model" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <soapenv:Body>
            <q0:updateById>
              <q0:model>
                <q1:fullName>${employeeNameEdit}</q1:fullName>
                <q1:id>${idEdit}</q1:id>
                <q1:password>123456</q1:password>
                <q1:role>
                  <q1:description>0</q1:description>
                  <q1:id>${employeeRoleEdit}</q1:id>
                  <q1:name>0</q1:name>
                </q1:role>
                <q1:username>nguyen</q1:username>
              </q0:model>
            </q0:updateById>
          </soapenv:Body>
        </soapenv:Envelope>`,
          contentType: "text/xml",
          async: false,
          headers: {
            "SOAPAction": "",
            "Authentication":getBearerToken()
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
            docs= $(response).find("updateByIdResponse").text();
           
            let docsReturn = JSON.parse(docs);
            console.log(docsReturn);
            
              // console.log(docsReturn.status);
              if(docsReturn!=null){
                  if(docsReturn.status==true){
                    isSuccess = true
                    
                  }
              }
            
          }
        });
        if(isSuccess){
          messageReturn = "Sửa thành công!";
         
          $("#edit-form").trigger("reset");
          generateData();
        }else{
          messageReturn = "Thất bại, không tìm thấy nhân viên này!";
        }
        $("#message-content").text(messageReturn);
                if(messageReturn!=""){
                  alertModal.modal("show");
                }
        
      }
  })

    $("#create-button").on("click",function(){
    
      
     if(checkLogin()){
      showRoleOpt();
      $("#employeeManagementModal").modal('show');
     }
    })
    $("#find-btn").on("click",function(){
        // alert("find function actived")
        let complexData = $("#complex-data").val();
        console.log("check complexData:",complexData);
        $.ajax({
          url: "http://localhost:8080/MovieTicketManagementVer3/services/AccountServiceImp",
          type: "POST",
          dataType: "xml",
          data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <soapenv:Body>
            <q0:getByComplexData>
              <q0:data>${complexData}</q0:data>
            </q0:getByComplexData>
          </soapenv:Body>
        </soapenv:Envelope>`,
          contentType: "text/xml",
          async: false,
          headers: {
            "SOAPAction": "",
            "Authentication":getBearerToken()
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
          //    console.log(response);
            docs= $(response).find("getByComplexDataResponse").text();
            console.log("docs:",docs);
      
            let docsReturn = JSON.parse(docs);
            console.log(docsReturn);
      
              // console.log(docsReturn.status);
              if(docsReturn!=null){
                  let tbody ="";
                  docsReturn.data.forEach(function(element){
                    tbody+=` <tr>
                    <td>${element.id}</td>
                    <td>${element.username}</td>
                    <td>${element.fullName}</td>
                    <td>${element.role.name}</td>
                    <td><button id="${element.id}" class='btn btn-primary editBtn btn-action'>Edit</button> 
                        <button id ="${element.id}" class='btn btn-danger deleteBtn btn-action'>Delete</button>
                    </td>
                    </tr>
                   `;
                  });
                  
                   $("#staff-table-content").html(tbody);
                  
      
                  
              }else{
                  messageReturn = "";
                  $("#message-content").text(messageReturn);
                  if(messageReturn!=""){
                    alertModal.modal("show");
                  }
              }
            
          }
        });
        if(!signined){
          $("#message-content").text(messageReturn);
                  if(messageReturn!=""){
                    alertModal.modal("show");
                  }
          setTimeout(function(){
            window.location.href = "login.html";
        }, 2500);
        }
        
    })
});
