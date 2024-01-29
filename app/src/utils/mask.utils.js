const maskTelefone = function(tel) {
  tel = tel.replace(/\D/g, "");
  tel = tel.replace(/^(\d)/, "($1");
  tel = tel.replace(/(.{3})(\d)/, "$1)$2");
  if (tel.length == 9) {
    tel = tel.replace(/(.{1})$/, "-$1");
  } else if (tel.length == 10) {
    tel = tel.replace(/(.{2})$/, "-$1");
  } else if (tel.length == 11) {
    tel = tel.replace(/(.{3})$/, "-$1");
  } else if (tel.length == 12) {
    tel = tel.replace(/(.{4})$/, "-$1");
  } else if (tel.length > 12) {
    tel = tel.replace(/(.{4})$/, "-$1");
  }
  return tel;
};

const maskCreditCardNumber = (creditCardNumber) => {
  creditCardNumber = creditCardNumber.replace(/\D/g, "");
  creditCardNumber = creditCardNumber.replace(/^(\d{4})(\d)/, "$1 $2");
  creditCardNumber = creditCardNumber.replace(
    /^(\d{4})\ (\d{4})(\d)/,
    "$1 $2 $3"
  );
  creditCardNumber = creditCardNumber.replace(
    /^(\d{4})\ (\d{4})\ (\d{4})(\d)/,
    "$1 $2 $3 $4"
  );
  return creditCardNumber;
};

const maskCreditCardExpireDate = (value) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/, "$1/$2");

  return value;
};

const onlyNumber = (value) => {
  return value.replace(/\D/g, "");
};

const maskCNPJ = function(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");
  cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
  cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");
  return cnpj;
};

const maskCPF = function(cpf) {
  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return cpf;
};

const maskCEP = function(cep) {
  cep = cep.replace(/\D/g, "");
  cep = cep.replace(/^(\d{2})(\d)/, "$1.$2");
  cep = cep.replace(/\.(\d{3})(\d)/, ".$1-$2");
  return cep;
};

function removeMask(num) {
  num = num.replace(/\D/g, "");
  return num;
}

// Funções utilizadas para formatar números. Ex: R$ 10.50
const unFormart = (value) => {
  return value
    .toString()
    .replace(".", "")
    .replace(".", "")
    .replace(".", "")
    .replace(".", "")
    .replace(".", "")
    .replace(",", "")
    .replace(" ", "")
    .replace("R$", "");
};

const unFormartPercent = (value) => {
  return value
    .toString()
    .replace(".", "")
    .replace(".", "")
    .replace(".", "")
    .replace(".", "")
    .replace(".", "")
    .replace(",", "")
    .replace(" ", "")
    .replace("%", "");
};

function format(value) {
  let negativo = value < 0;

  value = parseFloat(value)
    .toFixed(2)
    .toString()
    .replace("-", "")
    .split(".");

  value[0] =
    `${negativo ? "-" : ""}R$ ` + value[0].split(/(?=(?:...)*$)/).join(".");
  return value.join(",");
}


function formatPercent(value) {
  let negativo = value < 0;

  value = parseFloat(value)
    .toFixed(2)
    .toString()
    .replace("-", "")
    .split(".");

  value[0] =
    `${negativo ? "-" : ""}` + value[0].split(/(?=(?:...)*$)/).join("");
  return value.join(",") + '%';
}

function replaceValue(value) {
  return value.replace(/([0-9]{2})$/g, ".$1");
}

export {
  maskTelefone,
  maskCNPJ,
  maskCPF,
  removeMask,
  format,
  unFormart,
  replaceValue,
  maskCreditCardNumber,
  maskCreditCardExpireDate,
  onlyNumber,
  formatPercent,
  unFormartPercent
};
