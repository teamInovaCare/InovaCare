const mascaraCep = (event) => {
    let input = event.target;
    
    let value= input.value;

    if(!value){
        input.value = "";
        return;
    }

    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');

    input.value = value;
}