export const generateUsersTableTemplate = (users) =>
  users
    .map(
      (user) => `
      <tr data-info='${JSON.stringify(user)}'>
        <td><input type="checkbox" /></td>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.first_name} ${user.last_name}</td>
        <td>${user.phone_number}</td>
        <td>${user.email}</td>
        <td>${user.is_phone_verified ? "تایید شده" : "تایید نشده"}</td>
        <td>
          <button class="btn btn-info" onclick="showEditModal(event)">ویرایش</button>
          <button class="btn btn-danger" onclick="showDeleteSwal(event)">حذف</button>
          <button class="btn btn-info" onclick="showInfoModal(event)">مشاهده</button>
        </td>
      </tr>
    `
    )
    .join("");

export const generateUserEditModalTemplate = (
  userAllData,
  allGroups,
  allPermissions
) => `
    <div class="user-edit-modal-content">
    <span
      class="user-edit-close"
      onclick="hideEditModal()"
      id="closeUserEditModalBtn"
      >&times;</span
    >
    <h2 align="center">ویرایش اطلاعات کاربر</h2>
    <form id="userEditForm" onsubmit="editUser(event)">
      <input disabled class="hide" type="text" name="id" id="edit_id" />
      <label for="edit_username">نام کاربری:</label>
      <input
        type="text"
        name="username"
        id="edit_username"
        placeholder="نام کاربری"
        value="${userAllData.username}"
      />

      <label for="edit_first_name">نام:</label>
      <input
        type="text"
        name="first_name"
        id="edit_first_name"
        placeholder="نام"
        value="${userAllData.first_name}"
      />

      <label for="edit_last_name">نام خانوادگی:</label>
      <input
        type="text"
        name="last_name"
        id="edit_last_name"
        placeholder="نام خانوادگی"
        Value="${userAllData.last_name}"
      />

      <label for="edit_phone_number">شماره تماس:</label>
      <input
        type="text"
        id="edit_phone_number"
        placeholder="شماره تماس"
        disabled
        name="phone_number"
        value="${userAllData.phone_number}"
      />

      <label for="edit_email">ایمیل:</label>
      <input name="email" type="email" id="edit_email" value="${
        userAllData.email
      }" placeholder="ایمیل" />

      <!-- بخش انتخاب گروه‌ها -->
      <div class="select-container">
        <label>گروه‌ها:</label>
        <div id="groupSelectWrapper" class="select-scrollable">
          ${
            userAllData.groups.length
              ? userAllData.groups.map(
                  (userGroup) => `
              <div class="select-item">
                <select  class="user-select group-select">
              
                  ${allGroups.map(
                    (globalGroup) => `
                      <option value="${globalGroup.group_name}" ${
                      userGroup.name == globalGroup.group_name ? "selected" : ""
                    }>${globalGroup.group_name}</option>
                    `
                  )}
                </select>
                <button type="button" class="add-btn" onclick="addSelect('group')">
                  +
                </button>
                <button type="button" class="remove-btn" onclick="removeSelect(this)">
                  −
                </button>
              </div>
            `
                )
              : `
              <div class="select-item">
                <select  class="user-select group-select">   
                  <option value="" selected>انتخاب گروه</option>               
                  ${allGroups.map(
                    (globalGroup) => `
                      <option value="${globalGroup.group_name}">${globalGroup.group_name}</option>
                    `
                  )}
                </select>
                <button type="button" class="add-btn" onclick="addSelect('group')">
                  +
                </button>
                <button type="button" class="remove-btn" onclick="removeSelect(this)">
                  −
                </button>
              </div>
            `
          }
        </div>
      </div>

      <!-- بخش انتخاب دسترسی‌ها -->
      <div class="select-container">
        <label>سطوح دسترسی:</label>
        <div id="permissionSelectWrapper" class="select-scrollable">
          ${
            userAllData.permissions.length
              ? userAllData.permissions.map(
                  (userPermission) => `
              <div class="select-item">
                <select class="user-select permission-select">
                  ${allPermissions.map(
                    (globalPermission) => `
                      <option value="${globalPermission.id}" ${
                      userPermission.id === globalPermission.id ? "selected" : ""
                    }>${globalPermission.name}</option>
                    `
                  )}
                </select>
                <button
                  type="button"
                  class="add-btn"
                  onclick="addSelect('permission')"
                >
                  +
                </button>
                <button type="button" class="remove-btn" onclick="removeSelect(this)">
                  −
                </button>
              </div>
            `
                )
              : `
              <div class="select-item">
                <select class="user-select permission-select">
                  <option value="" selected>انتخاب سطح دسترسی</option>
                  ${allPermissions.map(
                    (globalPermission) => `
                      <option value="${globalPermission.id}">${globalPermission.name}</option>
                    `
                  )}
                </select>
                <button
                  type="button"
                  class="add-btn"
                  onclick="addSelect('permission')"
                >
                  +
                </button>
                <button type="button" class="remove-btn" onclick="removeSelect(this)">
                  −
                </button>
              </div>
            `
          }
        </div>
      </div>

      <div class="user-edit-actions">
        <button
          type="button"
          class="user-edit-cancel-btn"
          onclick="hideEditModal()"
        >
          انصراف
        </button>
        <button type="submit" class="user-edit-submit-btn">ویرایش</button>
      </div>
    </form>
  </div>
  `;



export const generateUserInfoModalTemplate = userAllData => `
 <div class="user-info-modal-content">
    <span onclick="hideInfoModal()" class="user-info-close">&times;</span>
    <h2 class="modal-title">مشخصات کاربر</h2>

    <div class="user-info-field"><strong>نام کاربری:</strong> ${
      userAllData.username
    }</div>
    <div class="user-info-field"><strong>ایمیل:</strong> ${
      userAllData.email
    }</div>
    <div class="user-info-field"><strong>نام:</strong> ${
      userAllData.first_name
    }</div>
    <div class="user-info-field"><strong>نام خانوادگی:</strong> ${
      userAllData.last_name
    }</div>
    <div class="user-info-field"><strong>شماره موبایل:</strong> ${
      userAllData.phone_number
    }</div>
    <div class="user-info-field">
      <strong>وضعیت تأیید موبایل:</strong> ${
        userAllData.is_phone_number_verified ? "تأیید شده" : "تأیید نشده"
      }
    </div>

    <div class="user-info-field">
      <strong>گروه‌ها:</strong>
      <ul class="user-info-list scrollable-list">
        
        ${userAllData.groups.map((group) => `<li>${group.name}</li>`).join("")}
      </ul>
    </div>

    <div class="user-info-field">
      <strong>سطوح دسترسی:</strong>
      <ul class="user-info-list scrollable-list">
        ${userAllData.permissions.map((permission) => `<li>${permission.name}</li>`).join("")}
      </ul>
    </div>
  </div>
`


export const generateSelectTemplate = (
  type,
  allGroups,
  allPermissions
) => `
  <div class="select-item">
    <select class="user-select ${type}-select">
      <option value="">انتخاب ${type === "group" ? "گروه" : "سطح دسترسی"}</option>
      ${(type === "group" ? allGroups : allPermissions).map(item => `<option value="${item.id || item.group_name}">${item.group_name || item.name}</option>`).join("")}
    </select>
    <button type="button" class="add-btn" onclick="addSelect('${type}')">+</button>
    <button type="button" class="remove-btn" onclick="removeSelect(this)">−</button>
  </div>
`
