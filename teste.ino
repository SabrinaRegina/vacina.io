#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

int botao = 16;
boolean botaoState = false;
boolean botaoOldState = false;

char Mensagem[] = "{\"$class\": \"org.example.basic.Vacinacao\",\"asset\": \"org.example.basic.Vacina#1234\",\"nomeUBS\": \"UBS Vila Sabrina\",\"nomeProfissional\": \"Enf. Sabrina\",\"coren\": \"36600\",\"lote\": \"34565\",\"validade\": \"29/07/2018\",\"estado\": \"TOMOU\"}";

void setup() {
 
  Serial.begin(115200);                                  //Serial connection
  WiFi.begin("Hackaton AngelHack", "hackaton@2018");   //WiFi connection
  pinMode(botao, INPUT);
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
 
    delay(500);
    Serial.println("Waiting for connection");
 
  }
}
 
void loop() {
 
 if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
   HTTPClient http;    //Declare object of class HTTPClient

   botaoOldState = botaoState;
   botaoState = digitalRead(botao);
   
   if (botaoState == false && botaoOldState == true)
   {
   
    
   http.begin("http://104.196.41.9:3000/api/Vacinacao");      //Specify request destination
   http.addHeader("Content-Type", "application/json");  //Specify content-type header  
   //http.addHeader("Authorization", " Basic YWRtaW46YWRtaW4=");
   int httpCode = http.POST(Mensagem);   //Send the request
   String payload = http.getString();                  //Get the response payload
   Serial.println(httpCode);   //Print HTTP return code
   Serial.println(payload);    //Print request response payload
   }
   
   
 
   http.end();  //Close connection
 
 }else{
 
    Serial.println("Error in WiFi connection");   
 
 }
  delay(30000);  //Send a request every 30 seconds
}
