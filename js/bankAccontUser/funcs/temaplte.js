export const generateBankAccountsTemplate = bankAccounts => 
  bankAccounts.map(bankAccount => `
    <tr data-info='${JSON.stringify(bankAccount)}' >
      <td><input type="checkbox" class="row-checkbox" /></td>
      <td>${bankAccount.id}</td>
      <td>${bankAccount.bank}</td>
      <td>${bankAccount.account_type}</td>
      <td>${bankAccount.account_number}</td>
      <td>${bankAccount.sheba_number}</td>
      <td>${bankAccount.is_default ? "بله" : "خیر"}</td>
      <td>
        <button class="edit-btn" onclick='showBankAccountEditModal(event)'>ویرایش</button>
        <button class="delete-btn" onclick='deleteBankAccount(event)'>حذف</button>
      </td>      
    </tr>
  `)
  .join("");