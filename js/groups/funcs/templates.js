export const generateGroupsTableTemplate = (groups) =>
  groups
    .map(
      (group, index) => `
      <tr data-info='${JSON.stringify(group)}'>
        <td><input type="checkbox" /></td>
        <td>${index + 1}</td>
        <td>${group.group_name}</td>
        <td>
          <button class="btn btn-info" onclick="showEditModal(event)">ویرایش دسترسی</button>
        </td>
      </tr>
    `
    )
    .join("");


export const generateSelectTemplate = (
  allPermissions
) => `
  <div class="select-item">
    <select class="user-select permission-select">
      <option value="">انتخاب سطح دسترسی</option>
      ${allPermissions.map(item => `<option value="${item.id}">${item.name}</option>`).join("")}
    </select>
    <button type="button" class="add-btn" onclick="addSelect('permission')">+</button>
    <button type="button" class="remove-btn" onclick="removeSelect(this)">−</button>
  </div>
`



export const generateCreateModalTemplate = (allPermissions) => `
  <div class="user-create-modal-content">
    <span
      class="user-create-close"
      onclick="hideCreateModal()"
      id="closeUserCreateModalBtn"
      >&times;</span
    >
    <h2 align="center">ساخت گروه جدید</h2>
    <form id="userCreateForm" data-creating="true" onsubmit="submitGroup(event)">
      <label for="create_username">نام گروه:</label>
      <input type="text" name="name" id="name" placeholder="نام گروه" required />

      <div class="select-container">
        <label>سطوح دسترسی:</label>
        <div id="permissionSelectWrapper" class="select-scrollable">

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

        </div>
      </div>

      

      <div class="user-create-actions">
        <button
          type="button"
          class="user-create-cancel-btn"
          onclick="hideCreateModal()"
        >
          انصراف
        </button>
        <button type="submit" class="user-create-submit-btn">ثبت</button>
      </div>
    </form>
  </div>
`

export const generateEditModalTemplate = (groupName, allPermissions, userPermissions) => `
  <div class="user-edit-modal-content">
    <span
      class="user-edit-close"
      onclick="hideEditModal()"
      id="closeUserEditModalBtn"
      >&times;</span
    >
    <h2 align="center">ویرایش دسترسی گروه</h2>
    <form id="userEditForm" onsubmit="submitGroup(event)">
      <label for="edit_username">نام گروه:</label>
      <input type="text" name="name" id="name" placeholder="نام گروه" required disabled value=${groupName} />

      <div class="select-container">
        <label>سطوح دسترسی:</label>
        <div id="permissionSelectWrapper" class="select-scrollable">

        ${
            userPermissions.length
              ? userPermissions.map(
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
`