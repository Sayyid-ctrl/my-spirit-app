/**
 * GOOGLE APPS SCRIPT WEB APP - MY SPIRIT APP
 * ID Spreadsheet: zVJlq4nxckHYXy4kPjIHe7RU0uhQe6xTC0RKQmoY
 * ID Script: 12DeUXHPI7yWyy9-LET38m5fllnWMcoOb9ov1QflFFqh2GcZpes8uGv8v
 */

const SPREADSHEET_ID = "zVJlq4nxckHYXy4kPjIHe7RU0uhQe6xTC0RKQmoY";

function getSpreadsheet() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * JALANKAN FUNGSI INI SATU KALI UNTUK MEMBUAT SEMUA SHEET & HEADER OTOMATIS!
 */
function setupDatabaseAuto() {
  const ss = getSpreadsheet();
  
  const tables = [
    {
      name: "tb_motivasi",
      headers: ["id_motivasi", "judul", "isi_motivasi", "kategori", "sumber", "status", "created_at"],
      initialData: [
        ["M01", "Keutamaan Menuntut Ilmu", "Barangsiapa yang menempuh jalan untuk menuntut ilmu, Allah akan mudahkan baginya jalan menuju surga.", "Keutamaan Ilmu", "HR. Muslim", "Aktif", new Date().toISOString()],
        ["M02", "Semangat Hafalan Santri", "Penghafal Al-Qur'an adalah keluarga Allah di bumi. Jangan lelah mengulang muraja'ahmu setiap hari.", "Santri", "Nasihat Kiai", "Aktif", new Date().toISOString()],
        ["M03", "Istiqomah dalam Kebaikan", "Amalan yang paling dicintai Allah adalah amalan yang kontinyu (rutin) meskipun sedikit.", "Ibadah", "HR. Bukhari & Muslim", "Aktif", new Date().toISOString()],
        ["M04", "Waktu Adalah Pedang", "Waktu bagaikan pedang. Jika engkau tidak memotongnya dengan kegiatan bermanfaat, ia akan memotongmu.", "Umum", "Mahfuzhat", "Aktif", new Date().toISOString()]
      ]
    },
    {
      name: "tb_kategori",
      headers: ["id_kategori", "nama_kategori", "status"],
      initialData: [
        ["K01", "Keutamaan Ilmu", "Aktif"],
        ["K02", "Santri", "Aktif"],
        ["K03", "Ibadah", "Aktif"],
        ["K04", "Umum", "Aktif"]
      ]
    },
    {
      name: "tb_target_belajar",
      headers: ["id_target", "id_user", "tanggal", "judul_target", "status", "created_at"],
      initialData: [
        ["T01", "default_user", new Date().toISOString().split("T")[0], "Setoran Ziyadah 1 Halaman", "Selesai", new Date().toISOString()],
        ["T02", "default_user", new Date().toISOString().split("T")[0], "Muroja'ah Jus 30", "Belum", new Date().toISOString()]
      ]
    },
    {
      name: "tb_users",
      headers: ["id_user", "nama", "username", "role", "status"],
      initialData: [
        ["U01", "Administrator", "admin", "admin", "Aktif"]
      ]
    }
  ];

  tables.forEach(table => {
    let sheet = ss.getSheetByName(table.name);
    if (!sheet) {
      sheet = ss.insertSheet(table.name);
    }
    
    // Set Headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(table.headers);
      // Bold Header
      sheet.getRange(1, 1, 1, table.headers.length).setFontWeight("bold").setBackground("#ccfbf1");
      
      // Append initial sample data
      if (table.initialData) {
        table.initialData.forEach(row => sheet.appendRow(row));
      }
    }
  });

  Logger.log("Berhasil membuat seluruh sheet dan header otomatis!");
}

function doGet(e) {
  const action = e ? e.parameter.action : "";
  let responseData = { success: false, message: "Action tidak valid" };

  try {
    const ss = getSpreadsheet();

    if (action === "getMotivasi") {
      const sheet = ss.getSheetByName("tb_motivasi");
      const data = getSheetDataAsJSON(sheet);
      responseData = { success: true, data: data.filter(d => d.status === "Aktif") };
    } 
    else if (action === "getKategori") {
      const sheet = ss.getSheetByName("tb_kategori");
      const data = getSheetDataAsJSON(sheet);
      responseData = { success: true, data: data.filter(d => d.status === "Aktif") };
    }
    else if (action === "getTarget") {
      const idUser = (e && e.parameter.id_user) ? e.parameter.id_user : "default_user";
      const sheet = ss.getSheetByName("tb_target_belajar");
      const data = getSheetDataAsJSON(sheet);
      responseData = { success: true, data: data.filter(d => d.id_user === idUser) };
    }
  } catch (err) {
    responseData = { success: false, error: err.toString() };
  }

  return createJsonResponse(responseData);
}

function doPost(e) {
  let responseData = { success: false, message: "Request tidak valid" };
  
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const ss = getSpreadsheet();

    if (action === "saveTarget") {
      const sheet = ss.getSheetByName("tb_target_belajar");
      const data = body.payload;
      
      if (data.id_target) {
        // Update Target
        const rows = sheet.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
          if (rows[i][0] == data.id_target) {
            sheet.getRange(i + 1, 4).setValue(data.judul_target);
            sheet.getRange(i + 1, 5).setValue(data.status);
            break;
          }
        }
      } else {
        // Insert Target Baru
        const newId = "T_" + new Date().getTime();
        sheet.appendRow([
          newId,
          data.id_user || "default_user",
          new Date().toISOString().split("T")[0],
          data.judul_target,
          data.status || "Belum",
          new Date().toISOString()
        ]);
      }
      responseData = { success: true, message: "Target berhasil disimpan" };
    }
    else if (action === "deleteTarget") {
      const sheet = ss.getSheetByName("tb_target_belajar");
      const idTarget = body.id_target;
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] == idTarget) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      responseData = { success: true, message: "Target berhasil dihapus" };
    }
    else if (action === "saveMotivasi") {
      const sheet = ss.getSheetByName("tb_motivasi");
      const data = body.payload;
      const newId = "M_" + new Date().getTime();
      sheet.appendRow([
        newId,
        data.judul,
        data.isi_motivasi,
        data.kategori,
        data.sumber,
        "Aktif",
        new Date().toISOString()
      ]);
      responseData = { success: true, message: "Motivasi berhasil disimpan" };
    }
  } catch (err) {
    responseData = { success: false, error: err.toString() };
  }

  return createJsonResponse(responseData);
}

function getSheetDataAsJSON(sheet) {
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const headers = rows[0];
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  return data;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
