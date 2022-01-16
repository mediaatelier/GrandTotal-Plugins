var payment = query().record();
var fullAmount = payment.amount 
var percentage = (fullAmount * 0.2).toPrecision(2);
payment.amount = fullAmount - percentage;

var otherPayment = insertRecord("Payment");
otherPayment.amount = percentage;
otherPayment.parentDocument = payment.parentDocument;
otherPayment.paymentType = fetchRecordWithPredicate("PaymentType","name LIKE 'Test'");
otherPayment.notes = "Created by Plugin!";
