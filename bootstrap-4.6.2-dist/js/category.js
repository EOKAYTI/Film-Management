var bearerToken;
var signined;
var username;
var messageReturn;
var bearerToken;
var signined;
var isSuccess = false;
var idSelect;
var lineSelect;
var announce;
function getBearerToken(){
    announce = $("#announce");
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
    url: "http://localhost:8080/MovieTicketManagementVer3/services/CategoryServiceImp",
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
      docs= $(response).find("getAllReturn").text();
     
      let docsReturn = JSON.parse(docs);
      console.log(docsReturn);

        // console.log(docsReturn.status);
        if(docsReturn!=null){
            let tbody ="";
            docsReturn.data.forEach(function(element){
              
              tbody+=` <tr>
              <td>${element.id}</td>
              <td>${element.name}</td>

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
        let categoryName = $('#category-name').val();
        console.log("check category:",categoryName);
        // validating
        let isValid = false;
        let message = "";
        if(categoryName==null||categoryName==""){
             message ="Vui lòng điền tên loại phim.";
            //  console.log("not valid")
        }
        else{
            isValid = true;
            message ="";
            $("#employeeManagementModal").modal('hide');

        }
        announce.text(message);
        if(isValid){
            // insert to server
            $.ajax({
              url: "http://localhost:8080/MovieTicketManagementVer3/services/CategoryServiceImp",
              type: "POST",
              dataType: "xml",
              data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:q1="http://model" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
              <soapenv:Body>
                <q0:create>
                  <q0:model>
                    <q1:id>1</q1:id>
                    <q1:name>${categoryName}</q1:name>
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
              $("#message-content").text("Tạo thành công!");
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
      messageReturn = "";
      $.ajax({
        url: "http://localhost:8080/MovieTicketManagementVer3/services/CategoryServiceImp",
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
          docs= $(response).find("deleteByIdResponse").text();
         
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
        messageReturn = "Xóa thất bại, loại phim không tồn tại!";
        generateData();
      }
      $("#message-content").text(messageReturn);
                if(messageReturn!=""){
                  alertModal.modal("show");
                }
      //
    })

  // Xử lý sự kiện click cho nút Edit
  var idEdit ;
  $("#staff-table-content").on("click",".editBtn",function () {
    checkLogin();
    idEdit = $(this).attr("id");
    console.log(idEdit)
    $("#modifyEmployeeModal").modal('show');
      // Thường sẽ bao gồm việc lấy dữ liệu hàng hiện tại và điền vào form để chỉnh sửa
  });

  $("#btn_save-edit").on('click',function(){
    let message = "";
     let textEdit = $("#edit").val();
     if(textEdit=="") message = "Vui lòng điền tên loại phim.";
     console.log("check id:",idEdit);
      $("#announce-edit").text(message);
      if(message==""){
        // valid
        $("#modifyEmployeeModal").modal('hide');
        $.ajax({
          url: "http://localhost:8080/MovieTicketManagementVer3/services/CategoryServiceImp",
          type: "POST",
          dataType: "xml",
          data: `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:q0="http://imp.service" xmlns:q1="http://model" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
          <soapenv:Body>
            <q0:updateById>
              <q0:model>
                <q1:id>${idEdit}</q1:id>
                <q1:name>${textEdit}</q1:name>
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
            docs= $(response).find("updateByIdReturn").text();
           
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
          messageReturn = "Thất bại, không tìm thấy!";
        }
        $("#message-content").text(messageReturn);
                if(messageReturn!=""){
                  alertModal.modal("show");
                }
        
      }
  })

    $("#create-button").on("click",function(){
      if(checkLogin()){
        $("#employeeManagementModal").modal('show');
      }
    
    })
    $("#find-btn").on("click",function(){
        // alert("find function actived")
        let complexData = $("#complex-data").val();
        console.log("check complexData:",complexData);
        $.ajax({
          url: "http://localhost:8080/MovieTicketManagementVer3/services/CategoryServiceImp",
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
            docs= $(response).find("getByComplexDataReturn").text();
            console.log("docs:",docs);
      
            let docsReturn = JSON.parse(docs);
            console.log(docsReturn);
      
              // console.log(docsReturn.status);
              if(docsReturn!=null){
                  let tbody ="";
                  docsReturn.data.forEach(function(element){
                    tbody+=` <tr>
                    <td>${element.id}</td>
                    <td>${element.name}</td>
      
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
