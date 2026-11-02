// Helper Function: แปลงชื่อวัน (Day) ให้เป็นชื่อเต็ม (Monday, Tuesday...)
function formatEnglishDay(dayStr) {
  if (!dayStr) return "";
  var map = {
    "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", 
    "Thu": "Thursday", "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday",
    "Monday": "Monday", "Tuesday": "Tuesday", "Wednesday": "Wednesday",
    "Thursday": "Thursday", "Friday": "Friday", "Saturday": "Saturday", "Sunday": "Sunday",
    "จันทร์": "Monday", "อังคาร": "Tuesday", "พุธ": "Wednesday", 
    "พฤหัสบดี": "Thursday", "ศุกร์": "Friday", "เสาร์": "Saturday", "อาทิตย์": "Sunday",
    "วันจันทร์": "Monday", "วันอังคาร": "Tuesday", "วันพุธ": "Wednesday", 
    "วันพฤหัสบดี": "Thursday", "วันศุกร์": "Friday", "วันเสาร์": "Saturday", "วันอาทิตย์": "Sunday",
    "จ.": "Monday", "อ.": "Tuesday", "พ.": "Wednesday", "พฤ.": "Thursday", "ศ.": "Friday", "ส.": "Saturday", "อา.": "Sunday",
    "จ": "Monday", "อ": "Tuesday", "พ": "Wednesday", "พฤ": "Thursday", "ศ": "Friday", "ส": "Saturday", "อา": "Sunday"
  };
  var clean = String(dayStr).trim();
  return map[clean] || clean;
}

// Helper Function: แปลงวันที่ (Date) ให้เป็นรูปแบบสากล (เช่น 01/Oct/2026)
function formatEnglishDate(dateStr) {
  if (!dateStr) return "";
  
  // กรณี dateStr เป็น Date object
  if (Object.prototype.toString.call(dateStr) === '[object Date]' || (dateStr instanceof Date)) {
    if (isNaN(dateStr.getTime())) return "";
    var engM = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dDay = ("0" + dateStr.getDate()).slice(-2);
    var dMonth = engM[dateStr.getMonth() + 1];
    var dYear = dateStr.getFullYear();
    return dDay + "/" + dMonth + "/" + dYear;
  }

  var thaiMonths = {
    "ม.ค.": "Jan", "ก.พ.": "Feb", "มี.ค.": "Mar", "เม.ย.": "Apr", 
    "พ.ค.": "May", "มิ.ย.": "Jun", "ก.ค.": "Jul", "ส.ค.": "Aug", 
    "ก.ย.": "Sep", "ต.ค.": "Oct", "พ.ย.": "Nov", "ธ.ค.": "Dec",
    "มค": "Jan", "กพ": "Feb", "มีค": "Mar", "เมย": "Apr", 
    "พค": "May", "มิย": "Jun", "กค": "Jul", "สค": "Aug", 
    "กย": "Sep", "ตค": "Oct", "พย": "Nov", "ธค": "Dec",
    "มกราคม": "Jan", "กุมภาพันธ์": "Feb", "มีนาคม": "Mar", "เมษายน": "Apr",
    "พฤษภาคม": "May", "มิถุนายน": "Jun", "กรกฎาคม": "Jul", "สิงหาคม": "Aug",
    "กันยายน": "Sep", "ตุลาคม": "Oct", "พฤศจิกายน": "Nov", "ธันวาคม": "Dec"
  };
  var engMonthsFull = {
    "january": "Jan", "february": "Feb", "march": "Mar", "april": "Apr",
    "may": "May", "june": "Jun", "july": "Jul", "august": "Aug",
    "september": "Sep", "october": "Oct", "november": "Nov", "december": "Dec"
  };

  var cleanStr = String(dateStr).trim();
  
  // ตรวจจับจาก parseSheetDateAny ก่อน
  var dateObj = parseSheetDateAny(cleanStr);
  if (dateObj) {
    var engM = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dDay = ("0" + dateObj.getDate()).slice(-2);
    var dMonth = engM[dateObj.getMonth() + 1];
    var dYear = dateObj.getFullYear();
    return dDay + "/" + dMonth + "/" + dYear;
  }

  // แทนที่เดือนภาษาไทยก่อน
  for (var thai in thaiMonths) {
    if (cleanStr.indexOf(thai) !== -1) {
      cleanStr = cleanStr.replace(thai, thaiMonths[thai]);
    }
  }
  // แทนที่ชื่อเดือนอังกฤษเต็ม (กรณียังไม่ถูกแปลง)
  for (var full in engMonthsFull) {
    var regex = new RegExp(full, "i");
    if (regex.test(cleanStr)) {
      cleanStr = cleanStr.replace(regex, engMonthsFull[full]);
    }
  }

  var parts = cleanStr.split(/[\/\-\.]/);
  var engMonths = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  if (parts.length === 3) {
    var day, monthPart, year;
    if (parts[0].length === 4) { // YYYY-MM-DD
      year = parseInt(parts[0], 10);
      monthPart = parts[1];
      day = ("0" + parseInt(parts[2], 10)).slice(-2);
    } else {
      day = ("0" + parseInt(parts[0], 10)).slice(-2);
      monthPart = parts[1];
      year = parseInt(parts[2], 10);
    }
    if (year > 2200) year = year - 543;
    var monthNum = parseInt(monthPart, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      var monthLower = String(monthPart).toLowerCase();
      monthNum = engMonths.indexOf(monthPart);
      if (monthNum === -1) {
        var numMatch = monthLower.match(/(\d+)/);
        if (numMatch) monthNum = parseInt(numMatch[1], 10);
      }
    }
    if (monthNum >= 1 && monthNum <= 12) {
      return day + "/" + engMonths[monthNum] + "/" + year;
    }
  }

  return cleanStr;
}

// Helper Function: แปลงเวลาเที่ยงคืนหรือตัด string ยาวๆ ให้เป็น HH:MM:SS
// isReadyTime=true → ค่า "00:00:00" ของ Ready หมายถึงครบ 24 ชม. (= "24:00:00")
// ส่วน Waiting/Standstill ค่า 0 ควรคงเป็น "00:00:00" ตามความจริง
function formatTimeString(timeStr, isReadyTime) {
  if (!timeStr) return "";
  var val = String(timeStr).trim();
  
  // ป้องกันเคสติดรูปแบบ Date Object / GMT ยาวๆ
  if (val.indexOf("GMT") !== -1 || val.length > 8) {
    var match = val.match(/\d{2}:\d{2}:\d{2}/);
    if (match) {
      val = match[0];
    }
  }

  if (isReadyTime === true && (val === "00:00:00" || val === "0:00:00" || val === "00:00" || val === "0:00")) {
    return "24:00:00";
  }
  return val;
}

// ย้ายชื่อชีตเดิม (CNC_...) ไปเป็นชื่อใหม่ (ROUTER_...) อัตโนมัติ — ข้อมูลในชีตคงเดิมทั้งหมด ไม่หาย
function migrateLegacySheetNames(ss) {
  try {
    var sheets = ss.getSheets();
    for (var s = 0; s < sheets.length; s++) {
      var name = sheets[s].getName();
      if (name.indexOf("CNC_") === 0) {
        var newName = null;
        if (name === "CNC_Master_Dashboard") newName = "ROUTER_Master_Dashboard";
        else if (name === "CNC_Master_Backup") newName = "ROUTER_Master_Backup";
        else if (name.indexOf("CNC_Dashboard_") === 0) newName = "ROUTER_Dashboard_" + name.substring("CNC_Dashboard_".length);
        if (newName && newName !== name && !ss.getSheetByName(newName)) {
          sheets[s].setName(newName);
        }
      }
    }
  } catch (err) {
    // ถ้าเปลี่ยนชื่อไม่ได้ ข้ามไปเลย
  }
}

// รหัสผ่าน Admin เก็บไว้ในฝั่งเซิร์ฟเวอร์เท่านั้น (ไม่เปิดเผยในเว็บ)
var ADMIN_PASSWORD = "st1910";
function syncRealtimeBackup(ss, fromSheet) {
  var masterSheet = fromSheet || getLatestMonthSheetWithData(ss) || ss.getSheetByName("ROUTER_Master_Dashboard") || ss.getSheetByName("CNC_Master_Dashboard");
  if (!masterSheet) return;

  var backupSheet = ss.getSheetByName("ROUTER_Master_Backup");
  if (!backupSheet) {
    var legacyBackup = ss.getSheetByName("CNC_Master_Backup");
    if (legacyBackup) {
      legacyBackup.setName("ROUTER_Master_Backup");
      backupSheet = legacyBackup;
    } else {
      backupSheet = ss.insertSheet("ROUTER_Master_Backup");
    }
  }

  var now = new Date();
  var lastRow = masterSheet.getLastRow();
  var lastCol = masterSheet.getLastColumn();

  if (lastRow > 0 && lastCol > 0) {
    // สำรองข้อมูลลง backup sheet โดยไม่แตะต้องเซลล์ A1 ของ masterSheet เพื่อรักษาชื่อหัวตาราง Machine No.10 ไว้
    backupSheet.clear();
    masterSheet.getRange(1, 1, lastRow, lastCol).copyTo(backupSheet.getRange(1, 1));
    backupSheet.insertRowBefore(1);
    backupSheet.getRange(1, 1).setValue("Real-time Backup Sync Timestamp: " + now.toLocaleString() + " (Source: " + masterSheet.getName() + ")");
    backupSheet.getRange(1, 1).setFontWeight("bold").setFontColor("#10b981");
  }
}

// ==== ระบบจัดการชีตรายเดือน: ชื่อหน้า sheet ระบุเดือน+ปี เช่น ROUTER_Dashboard_Oct2026 ====
// เมื่อข้อมูลเปลี่ยนเป็นเดือนใหม่ ระบบจะสร้างหน้า sheet + template ของเดือนนั้นให้อัตโนมัติ
// หน้า sheet ของเดือนเก่าคงอยู่เป็นประวัติ/ที่เก็บข้อมูลย้อนหลัง
var MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// แปลงข้อความวันที่หลายรูปแบบเป็น Date: 26/Oct/2026, 26/10/2026, 2026-10-26, 31. October 2026 (+ปี พ.ศ.)
// รองรับเดือนภาษาไทยทั้งย่อและเต็ม รวมถึงชื่อเดือนอังกฤษเต็มด้วย
function parseSheetDateAny(v) {
  var s = String(v || "").trim();
  if (!s) return null;

  var MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Pattern 1: DD/Mon/YYYY หรือ DD.Mon.YYYY หรือ DD-Mon-YYYY หรือ DD Mon YYYY (รองรับอังกฤษเต็ม/ไทยเต็ม/ไทยย่อ)
  var m = s.match(/^(\d{1,2})[\/\-\.\s]+([A-Za-z\u0e00-\u0e7f][A-Za-z\u0e00-\u0e7f\.]{1,})\.?[\/\-\.\s]+(\d{4})$/);
  // Pattern 2: dd/mm/yyyy (ตัวเลขทั้งหมด)
  if (m == null) m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  // Pattern 3: yyyy-mm-dd
  if (m == null) m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m == null) return null;

  var day, monthIdx, year;
  if (/^\d{4}$/.test(m[1])) {
    year = parseInt(m[1], 10); monthIdx = parseInt(m[2], 10) - 1; day = parseInt(m[3], 10);
  } else {
    day = parseInt(m[1], 10); year = parseInt(m[3], 10);
    if (/^\d{1,2}$/.test(m[2])) {
      monthIdx = parseInt(m[2], 10) - 1;
    } else {
      var tok = m[2].toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
      // ลองจับกับชื่อย่อ 3 ตัวอักษรก่อน (Jan, Feb...)
      monthIdx = MONTH_ABBR.map(function (x) { return x.toLowerCase(); }).indexOf(tok.slice(0, 3));
      // ลองจับกับชื่อเต็มภาษาอังกฤษ (January, February...)
      if (monthIdx === -1) {
        monthIdx = MONTH_FULL.map(function (x) { return x.toLowerCase(); }).indexOf(tok);
      }
      // ลองจับกับภาษาไทย
      var thaiMap = {
        "มค": 0, "กพ": 1, "มีค": 2, "เมย": 3, "พค": 4, "มิย": 5,
        "กค": 6, "สค": 7, "กย": 8, "ตค": 9, "พย": 10, "ธค": 11,
        "มกราคม": 0, "กุมภาพันธ์": 1, "มีนาคม": 2, "เมษายน": 3, "พฤษภาคม": 4, "มิถุนายน": 5,
        "กรกฎาคม": 6, "สิงหาคม": 7, "กันยายน": 8, "ตุลาคม": 9, "พฤศจิกายน": 10, "ธันวาคม": 11
      };
      if (monthIdx === -1 && thaiMap[tok] !== undefined) monthIdx = thaiMap[tok];
    }
  }

  if (year > 2200) year = year - 543; // ปี พ.ศ. -> ค.ศ.
  if (isNaN(day) || isNaN(monthIdx) || isNaN(year)) return null;
  if (monthIdx < 0 || monthIdx > 11) return null;
  var d = new Date(year, monthIdx, day);
  if (d.getFullYear() !== year || d.getMonth() !== monthIdx || d.getDate() !== day) return null;
  return d;
}

// เลือก "เดือนเป้าหมาย" จากวันที่จริงล่าสุดของข้อมูลที่ส่งมา (ถ้าไม่มีวันที่เลย ใช้เดือนปัจจุบันจริง)
function resolveTargetMonthFromPayload(machines) {
  var now = new Date();
  var best = null;
  (machines || []).forEach(function (m) {
    (m.data || []).forEach(function (item) {
      var d = parseSheetDateAny(item && item.date);
      if (!d) return;
      var key = d.getFullYear() * 12 + d.getMonth();
      if (best === null || key > best.key) best = { key: key, year: d.getFullYear(), monthIdx: d.getMonth() };
    });
  });
  if (best) return { year: best.year, monthIdx: best.monthIdx };
  return { year: now.getFullYear(), monthIdx: now.getMonth() };
}

function monthSheetName(year, monthIdx) {
  return "ROUTER_Dashboard_" + MONTH_ABBR[monthIdx] + year;
}

// ชื่อชีตรูปแบบเก่า (ก่อนเปลี่ยนชื่อระบบ CNC → ROUTER) — ใช้ค้นหาชีตของเดือนนั้นที่ยังใช้ชื่อเก่าอยู่
function legacyMonthSheetName(year, monthIdx) {
  return "CNC_Dashboard_" + MONTH_ABBR[monthIdx] + year;
}

// ตรวจว่าชีตนี้มี "เวลาจริง" ในแถว Ready/Working/Waiting/Standstill อย่างน้อย 1 ช่อง
function monthSheetHasData(sheet) {
  try {
    var lr = sheet.getLastRow();
    if (lr === 0) return false;
    var vals = sheet.getRange(1, 1, lr, sheet.getLastColumn()).getValues();
    for (var r = 0; r < vals.length; r++) {
      if (String(vals[r][0] || "").trim().indexOf("Machine: ") === 0) {
        for (var m = r + 3; m <= Math.min(r + 6, lr - 1); m++) {
          var rowVals = vals[m] || [];
          for (var c = 1; c < rowVals.length; c++) {
            if (String(rowVals[c] || "").trim()) return true;
          }
        }
      }
    }
  } catch (err) {}
  return false;
}

// หาหน้า sheet เดือนล่าสุดที่มีข้อมูลจริง (ใช้ตอน doGet ดึงข้อมูลกลับเข้าเว็บ)
// รองรับทั้งชื่อย่อเดือน (Oct, Jan...) และชื่อเต็ม (October, January...)
function getLatestMonthSheetWithData(ss) {
  var cands = [];
  var MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  ss.getSheets().forEach(function (sh) {
    // รองรับชื่อ ROUTER_Dashboard_Oct2026, ROUTER_Dashboard_October2026, CNC_Dashboard_... (ชีตประวัติที่ยังไม่ถูกย้ายชื่อ)
    var mm = sh.getName().match(/^(?:ROUTER|CNC)_Dashboard_([A-Za-z]{3,})(\d{4})$/);
    if (mm) {
      var monthStr = mm[1];
      var monthIdx = -1;
      // ลอง match กับชื่อย่อก่อน
      var abbrIdx = MONTH_ABBR.indexOf(monthStr);
      if (abbrIdx !== -1) {
        monthIdx = abbrIdx;
      } else {
        // ลอง match กับชื่อเต็ม (case-insensitive)
        var fullIdx = MONTH_FULL.map(function (x) { return x.toLowerCase(); }).indexOf(monthStr.toLowerCase());
        if (fullIdx !== -1) monthIdx = fullIdx;
      }
      if (monthIdx !== -1) cands.push({ sheet: sh, year: parseInt(mm[2], 10), monthIdx: monthIdx });
    }
  });
  cands.sort(function (a, b) { return (b.year * 12 + b.monthIdx) - (a.year * 12 + b.monthIdx); });
  for (var i = 0; i < cands.length; i++) {
    if (monthSheetHasData(cands[i].sheet)) return cands[i].sheet;
  }
  return null;
}

// หา/สร้างหน้า sheet ของเดือนเป้าหมาย:
// 1) มีหน้าของเดือนนั้นแล้ว -> ใช้เลย
// 2) ชีตเก่า "ROUTER_Master_Dashboard" เป็นข้อมูลของเดือนเป้าหมาย -> เปลี่ยนชื่อเป็นชื่อเดือนแล้วใช้ต่อ (ไม่ทำข้อมูลหาย)
// 3) ไม่มีเลย -> สร้างหน้าใหม่ + template ของเดือนนั้น
function getOrCreateMonthSheet(ss, year, monthIdx) {
  var name = monthSheetName(year, monthIdx);
  var sheet = ss.getSheetByName(name);
  if (sheet) return sheet;

  // ชีตของเดือนนี้เคยถูกสร้างด้วยชื่อเก่า (CNC_Dashboard_...) → เปลี่ยนชื่อเป็นชื่อใหม่แล้วใช้ต่อ (ข้อมูลคงเดิม)
  var legacyMonthSheet = ss.getSheetByName(legacyMonthSheetName(year, monthIdx));
  if (legacyMonthSheet) {
    try { legacyMonthSheet.setName(name); } catch (_) {}
    return legacyMonthSheet;
  }

  var legacySheet = ss.getSheetByName("ROUTER_Master_Dashboard") || ss.getSheetByName("CNC_Master_Dashboard");
  if (legacySheet && legacySheetContainsMonth(legacySheet, year, monthIdx)) {
    legacySheet.setName(name);
    return legacySheet;
  }

  sheet = ss.insertSheet(name);
  buildMonthlyTemplate(sheet, year, monthIdx);
  return sheet;
}

// ชีตเดิม (ก่อนมีระบบรายเดือน) เป็นข้อมูลของเดือนเป้าหมายหรือไม่
function legacySheetContainsMonth(legacySheet, year, monthIdx) {
  try {
    var lr = legacySheet.getLastRow();
    var lc = legacySheet.getLastColumn();
    if (lr === 0 || lc === 0) return false;
    var vals = legacySheet.getRange(1, 1, lr, lc).getValues();
    for (var i = 0; i < vals.length; i++) {
      for (var j = 1; j < vals[i].length; j++) {
        var d = parseSheetDateAny(vals[i][j]);
        if (d && d.getFullYear() === year && d.getMonth() === monthIdx) return true;
      }
    }
  } catch (err) {}
  return false;
}

// ฟังก์ชันสร้าง Template เปล่า 1 เดือน (ตามจำนวนวันจริงของเดือนที่กำหนด) ลงในหน้า sheet ที่ระบุ สำหรับทุกเครื่องจักร (10-27 และ 43-54)
function buildMonthlyTemplate(sheet, year, monthIdx) {
  var metrics = [
    "Day",
    "Date",
    "Ready for operation",
    "Operational mode working",
    "Operational mode waiting",
    "Standstill time due to error or stop",
    "Duty"
  ];

  var machinesList = [];
  for (var i = 10; i <= 27; i++) machinesList.push("Machine No." + i);
  for (var i = 43; i <= 54; i++) machinesList.push("Machine No." + i);

  var daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var engMonths = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var currentRow = 1;

  for (var mI = 0; mI < machinesList.length; mI++) {
    var machineName = machinesList[mI];

    sheet.getRange(currentRow, 1).setValue("Machine: " + machineName);
    sheet.getRange(currentRow, 1).setFontWeight("bold").setFontSize(11).setFontColor("#38bdf8");
    currentRow++;

    for (var r = 0; r < metrics.length; r++) {
      sheet.getRange(currentRow + r, 1).setValue(metrics[r]);
    }
    sheet.getRange(currentRow, 1, metrics.length, 1).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");

    // บังคับเป็นรูปแบบข้อความ (@) กันการแปลงวันที่/เวลาอัตโนมัติของ Google Sheets
    sheet.getRange(currentRow, 2, 7, daysInMonth).setNumberFormat("@");

    for (var d = 0; d < daysInMonth; d++) {
      var currDate = new Date(year, monthIdx, d + 1);
      var dayStr = dayNames[currDate.getDay()];
      var dateStr = ("0" + currDate.getDate()).slice(-2) + "/" + engMonths[currDate.getMonth() + 1] + "/" + currDate.getFullYear();

      var targetCol = d + 2;
      sheet.getRange(currentRow, targetCol).setValue(dayStr);
      sheet.getRange(currentRow + 1, targetCol).setValue(dateStr);

      sheet.getRange(currentRow, targetCol, 2, 1).setFontWeight("bold").setHorizontalAlignment("center");
    }

    sheet.getRange(currentRow, 1, 7, daysInMonth + 1).setBorder(true, true, true, true, true, true, "#334155", SpreadsheetApp.BorderStyle.SOLID);
    currentRow += 7 + 2;
  }

  sheet.autoResizeColumns(1, daysInMonth + 2);
}

// รันด้วยมือได้: สร้าง/สร้างใหม่หน้า sheet ของ "เดือนปัจจุบันจริง" (ล้างหน้านั้นก่อนสร้าง)
function createMonthlyTemplate() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  migrateLegacySheetNames(ss); // ย้ายชื่อชีตเก่า CNC_... → ROUTER_... (ครั้งแรกครั้งเดียว)
  var now = new Date();
  var name = monthSheetName(now.getFullYear(), now.getMonth());
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  sheet.clear();
  buildMonthlyTemplate(sheet, now.getFullYear(), now.getMonth());
  syncRealtimeBackup(ss);
}

// ฟังก์ชันรับข้อมูล POST และอัปเดตแบบสะสมข้อมูล (ไม่ลบข้อมูลเก่า/ไม่ซ้อนทับ)
function doPost(e) {
  try {
    // ตรวจสอบรหัสผ่าน Admin ก่อนการทำงาน (ถ้ามีการส่งรหัสผ่านมา)
    try {
      var rawData = e && e.postData ? JSON.parse(e.postData.contents) : {};
      if (rawData.action === "adminVerify") {
        var pw = rawData.password || "";
        if (pw !== ADMIN_PASSWORD) {
          return ContentService.createTextOutput(JSON.stringify({ result: "error", message: "รหัสผ่านไม่ถูกต้อง" })).setMimeType(ContentService.MimeType.JSON);
        }
        return ContentService.createTextOutput(JSON.stringify({ result: "success", message: "ยืนยันรหัสผ่านสำเร็จ" })).setMimeType(ContentService.MimeType.JSON);
      }
    } catch (_) {}

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("ไม่พบข้อมูล POST payload ที่ส่งเข้ามา");
    }

    var contents = JSON.parse(e.postData.contents);
    var machines = contents.machines || [];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    migrateLegacySheetNames(ss); // ย้ายชื่อชีตเก่า CNC_... → ROUTER_... (ครั้งแรกครั้งเดียว)

    // แยกกลุ่มข้อมูลตามเดือนจริง (ปีและเดือนของแต่ละวัน)
    // เพื่อป้องกันปัญหาข้อมูลรอยต่อสิ้นเดือน (เช่น 31/Oct กับ 01/Nov) ไปปนกันในชีตเดียว
    // รายการของเดือนไหนจะถูกบันทึกลงในชีตของเดือนนั้นเสมอ (Oct ลงชีต Oct, Nov ลงชีต Nov)
    var defaultTarget = resolveTargetMonthFromPayload(machines);
    var monthGroups = {}; // "year_monthIdx" -> { year, monthIdx, machinesMap: { [machineName]: [items] } }

    for (var mi = 0; mi < machines.length; mi++) {
      var mObj = machines[mi];
      var mName = String(mObj.name || "").trim();
      var mData = mObj.data || [];
      if (!mName) continue;

      for (var di = 0; di < mData.length; di++) {
        var item = mData[di];
        var parsedD = parseSheetDateAny(item && item.date);
        var itemYear = parsedD ? parsedD.getFullYear() : defaultTarget.year;
        var itemMonthIdx = parsedD ? parsedD.getMonth() : defaultTarget.monthIdx;
        var groupKey = itemYear + "_" + itemMonthIdx;

        if (!monthGroups[groupKey]) {
          monthGroups[groupKey] = {
            year: itemYear,
            monthIdx: itemMonthIdx,
            machinesMap: {}
          };
        }
        if (!monthGroups[groupKey].machinesMap[mName]) {
          monthGroups[groupKey].machinesMap[mName] = [];
        }
        monthGroups[groupKey].machinesMap[mName].push(item);
      }
    }

    // ถ้าไม่มีข้อมูลวันเลย ให้สร้าง/ใช้ชีตเดือนปัจจุบัน
    var groupKeys = Object.keys(monthGroups);
    if (groupKeys.length === 0) {
      groupKeys.push(defaultTarget.year + "_" + defaultTarget.monthIdx);
      monthGroups[groupKeys[0]] = {
        year: defaultTarget.year,
        monthIdx: defaultTarget.monthIdx,
        machinesMap: {}
      };
    }

    var recordsUpdated = 0;
    var metrics = ["Day", "Date", "Ready for operation", "Operational mode working", "Operational mode waiting", "Standstill time due to error or stop", "Duty"];

    // ประมวลผลแยกแต่ละเดือน
    for (var g = 0; g < groupKeys.length; g++) {
      var grp = monthGroups[groupKeys[g]];
      var sheet = getOrCreateMonthSheet(ss, grp.year, grp.monthIdx);
      if (!sheet) continue;

      // อ่านคอลัมน์ A ทั้งหมดครั้งเดียว เพื่อหาแถว Header ของแต่ละเครื่อง
      var lastRow = sheet.getLastRow();
      var colAValues = lastRow > 0 ? sheet.getRange(1, 1, lastRow, 1).getValues() : [];
      var headerRowMap = {}; // machineName -> แถว Header (1-based)
      for (var r = 0; r < colAValues.length; r++) {
        var cellA = String(colAValues[r][0] || "").trim();
        if (cellA.indexOf("Machine: ") === 0) {
          var foundName = cellA.replace("Machine: ", "").trim();
          if (!headerRowMap[foundName]) headerRowMap[foundName] = r + 1;
        }
      }

      var grpMachineNames = Object.keys(grp.machinesMap);
      for (var i = 0; i < grpMachineNames.length; i++) {
        var machineName = grpMachineNames[i];
        var extractedData = grp.machinesMap[machineName] || [];
        if (!machineName || extractedData.length === 0) continue;

        var machineHeaderRow = headerRowMap[machineName] || -1;

        if (machineHeaderRow === -1) {
          machineHeaderRow = sheet.getLastRow() > 0 ? sheet.getLastRow() + 3 : 1;
          sheet.getRange(machineHeaderRow, 1).setValue("Machine: " + machineName);
          sheet.getRange(machineHeaderRow, 1).setFontWeight("bold").setFontSize(11).setFontColor("#38bdf8");

          for (var m = 0; m < metrics.length; m++) {
            sheet.getRange(machineHeaderRow + 1 + m, 1).setValue(metrics[m]);
          }
          sheet.getRange(machineHeaderRow + 1, 1, 7, 1).setFontWeight("bold").setBackground("#0f172a").setFontColor("#ffffff");
          headerRowMap[machineName] = machineHeaderRow;
        }

        var tableStartRow = machineHeaderRow + 1;
        var existingMaxCol = sheet.getLastColumn();
        // อ่านเฉพาะแถบ 7 แถวของเครื่องนี้ (Day/Date/Ready/Working/Waiting/Standstill/Duty)
        var blockVals = existingMaxCol > 1 ? sheet.getRange(tableStartRow, 2, 7, existingMaxCol - 1).getValues() : [];

        var colByDate = {};
        var ownMaxCol = 1; // คอลัมน์สุดท้ายที่มีเนื้อหาจริงในแถบของเครื่องนี้
        for (var c = 0; c < (blockVals.length ? blockVals[0].length : 0); c++) {
          var dv = String(blockVals[1][c] || "").trim().toLowerCase(); // blockVals แถวที่ 1 = แถว Date
          if (dv) colByDate[dv] = c + 2;
          for (var rr = 0; rr < 7; rr++) {
            if (String(blockVals[rr][c] || "").trim()) {
              if (c + 2 > ownMaxCol) ownMaxCol = c + 2;
              break;
            }
          }
        }
        var maxNeededCol = ownMaxCol;

        // รวบรวมการอัปเดตของแต่ละคอลัมน์ก่อน แล้วเขียนลงชีตครั้งเดียว
        var updates = {}; // colIndex (1-based) -> ค่าที่จะเขียน
        for (var j = 0; j < extractedData.length; j++) {
          var item = extractedData[j];
          var dayVal = formatEnglishDay(item.day || "");
          var dateVal = formatEnglishDate(item.date || "");

          if (!dateVal) continue;

          var readyVal = formatTimeString(item.ready, true);
          var workingVal = formatTimeString(item.working);
          var waitingVal = formatTimeString(item.waiting);
          var standstillVal = formatTimeString(item.standstill);
          var dutyVal = (item.duty !== undefined && item.duty !== null && item.duty !== "") ? (item.duty + "%") : "";

          if (!readyVal && !workingVal && !waitingVal && !standstillVal && !dutyVal) {
            continue; // ไม่มีข้อมูลจริง ไม่ต้องเขียนลงชีต
          }

          var colKey = String(dateVal).trim().toLowerCase();
          var colIndex = colByDate[colKey];
          // เฉพาะวันที่ที่ตรงกับคอลัมน์ในชีตเดือนนี้เท่านั้น จึงจะเขียนลงในชีตนี้
          // ถ้าเป็นวันที่นอกเดือน หรือไม่มีในตาราง template จะไม่สร้างคอลัมน์เลยขอบเขตเดือนออกไป
          if (!colIndex) {
            var itemDateObj = parseSheetDateAny(dateVal);
            if (itemDateObj && itemDateObj.getMonth() === grp.monthIdx && itemDateObj.getFullYear() === grp.year) {
              colIndex = maxNeededCol + 1;
              colByDate[colKey] = colIndex;
            } else {
              continue; // วันที่ไม่ได้อยู่ในเดือนของชีตนี้ ข้ามไป
            }
          }
          if (colIndex > maxNeededCol) {
            maxNeededCol = colIndex;
          }

          updates[colIndex] = {
            day: dayVal,
            date: dateVal,
            ready: readyVal,
            working: workingVal,
            waiting: waitingVal,
            standstill: standstillVal,
            duty: dutyVal
          };
        }

        var colIndexes = Object.keys(updates);
        if (colIndexes.length > 0) {
          var blockWidth = maxNeededCol - 1; // จำนวนคอลัมน์ตั้งแต่คอลัมน์ B (2) ถึง maxNeededCol
          if (blockWidth > 0) {
            var block = sheet.getRange(tableStartRow, 2, 7, blockWidth).getValues();

            for (var k = 0; k < colIndexes.length; k++) {
              var ci = parseInt(colIndexes[k], 10);
              var idxInBlock = ci - 2;
              if (idxInBlock >= 0 && idxInBlock < blockWidth) {
                var u = updates[ci];
                block[0][idxInBlock] = u.day;
                block[1][idxInBlock] = u.date;
                if (u.ready) block[2][idxInBlock] = u.ready;
                if (u.working) block[3][idxInBlock] = u.working;
                if (u.waiting) block[4][idxInBlock] = u.waiting;
                if (u.standstill) block[5][idxInBlock] = u.standstill;
                if (u.duty) block[6][idxInBlock] = u.duty;
                recordsUpdated++;
              }
            }

            sheet.getRange(tableStartRow, 2, 7, blockWidth).setNumberFormat("@");
            sheet.getRange(tableStartRow, 2, 7, blockWidth).setValues(block);

            // จัดรูปแบบเป็นชุด (batch)
            sheet.getRange(tableStartRow, 2, 2, blockWidth).setFontWeight("bold").setHorizontalAlignment("center");
            sheet.getRange(tableStartRow + 2, 2, 4, blockWidth).setHorizontalAlignment("center");
            sheet.getRange(tableStartRow + 6, 2, 1, blockWidth).setFontWeight("bold").setFontColor("#10b981");
          }
        }

        // ล้างคอลัมน์ขยะ/ส่วนเกินที่เลยขอบเขตเดือนออกไป (เช่น คอลัมน์ 32 ที่เคยถูกเขียนหลุดออกไป)
        var daysInThisMonth = new Date(grp.year, grp.monthIdx + 1, 0).getDate();
        var normalMaxCol = daysInThisMonth + 1; // Col A คือ 1, Col B คือวันที่ 1 ... วันสุดท้ายคือ daysInThisMonth + 1
        if (existingMaxCol > normalMaxCol) {
          var clearWidth = existingMaxCol - normalMaxCol;
          sheet.getRange(tableStartRow, normalMaxCol + 1, 7, clearWidth).clearContent();
          sheet.getRange(tableStartRow, normalMaxCol + 1, 7, clearWidth).setBorder(false, false, false, false, false, false);
        }
        if (ownMaxCol >= 2) {
          sheet.getRange(tableStartRow, 1, 7, Math.min(ownMaxCol, normalMaxCol)).setBorder(true, true, true, true, true, true, "#334155", SpreadsheetApp.BorderStyle.SOLID);
        }
      }
      // ซิงค์ชีตสำรอง Real-time Backup ให้ชีตเดือนนี้
      try {
        syncRealtimeBackup(ss, sheet);
      } catch (backupErr) {}
      // ไม่เรียก autoResizeColumns ตอน sync เพราะคอลัมน์ตั้งไว้แล้วตั้งแต่ตอนสร้าง Template ช่วยให้ sync เร็วขึ้น 10 เท่า
    }

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "recordsUpdated": recordsUpdated,
      "message": "อัปเดตข้อมูลและซิงค์ชีต Backup สำเร็จ " + recordsUpdated + " รายการ"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var action = e && e.parameter && e.parameter.action;

  // Admin access verification (server-side password check)
  if (action === "adminVerify") {
    var verifyPw = (e && e.parameter && e.parameter.password) || "";
    if (verifyPw !== ADMIN_PASSWORD) {
      return ContentService.createTextOutput(JSON.stringify({
        result: "error", message: "รหัสผ่านไม่ถูกต้อง"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({
      result: "success", message: "ยืนยันรหัสผ่านสำเร็จ"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Lightweight connection check used by the Admin page.
  if (action === "health") {
    return ContentService.createTextOutput(JSON.stringify({
      result: "success", message: "Google Apps Script พร้อมใช้งาน", timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // GET-based sync bridge: returns the real write result to the browser (unlike no-cors POST).
  if (action === "sync") {
    try {
      var payloadText = e && e.parameter && e.parameter.payload;
      if (!payloadText) throw new Error("ไม่พบ payload สำหรับซิงค์ข้อมูล");
      return doPost({ postData: { contents: payloadText } });
    } catch (syncErr) {
      return ContentService.createTextOutput(JSON.stringify({ result: "error", message: syncErr.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (action === "fetch") {
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      migrateLegacySheetNames(ss); // ย้ายชื่อชีตเก่า CNC_... → ROUTER_... (ครั้งแรกครั้งเดียว)

      // รวบรวมชีตรายเดือนทั้งหมดที่มีอยู่ในระบบ เรียงตามลำดับเวลา (เก่า → ใหม่)
      // เพื่อให้สามารถดึงข้อมูลแบบหลายเดือน (Multi-Month) พร้อมกันได้ครบถ้วน
      var allMonthSheets = [];
      var MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      ss.getSheets().forEach(function (sh) {
        var mm = sh.getName().match(/^(?:ROUTER|CNC)_Dashboard_([A-Za-z]{3,})(\d{4})$/);
        if (mm) {
          var monthStr = mm[1];
          var monthIdx = MONTH_ABBR.indexOf(monthStr);
          if (monthIdx === -1) {
            monthIdx = MONTH_FULL.map(function (x) { return x.toLowerCase(); }).indexOf(monthStr.toLowerCase());
          }
          if (monthIdx !== -1 && monthSheetHasData(sh)) {
            allMonthSheets.push({ sheet: sh, year: parseInt(mm[2], 10), monthIdx: monthIdx });
          }
        }
      });
      allMonthSheets.sort(function (a, b) { return (a.year * 12 + a.monthIdx) - (b.year * 12 + b.monthIdx); });

      var targetSheets = allMonthSheets.map(function (item) { return item.sheet; });
      if (targetSheets.length === 0) {
        var legacySheet = ss.getSheetByName("ROUTER_Master_Dashboard") || ss.getSheetByName("CNC_Master_Dashboard");
        if (legacySheet && monthSheetHasData(legacySheet)) targetSheets.push(legacySheet);
      }

      if (targetSheets.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({
          "result": "success",
          "machines": []
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var machinesMap = {}; // machineName -> { name, dataMap: { [date]: item } }
      var machineOrder = [];

      for (var sIdx = 0; sIdx < targetSheets.length; sIdx++) {
        var sheet = targetSheets[sIdx];
        var lastRow = sheet.getLastRow();
        var lastCol = sheet.getLastColumn();
        if (lastRow === 0 || lastCol === 0) continue;

        var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
        for (var r = 0; r < values.length; r++) {
          var row = values[r];
          var firstCell = String(row[0] || "").trim();

          if (firstCell.indexOf("Machine: ") === 0) {
            var mName = firstCell.replace("Machine: ", "").trim();
            if (!machinesMap[mName]) {
              machinesMap[mName] = { name: mName, dataMap: {} };
              machineOrder.push(mName);
            }

            r += 1;
            var dayRow = values[r] || [];
            var dateRow = values[r + 1] || [];
            var readyRow = values[r + 2] || [];
            var workingRow = values[r + 3] || [];
            var waitingRow = values[r + 4] || [];
            var standstillRow = values[r + 5] || [];
            var dutyRow = values[r + 6] || [];

            for (var c = 1; c < row.length; c++) {
              var dateRaw = dateRow[c];
              var dateVal = formatEnglishDate(dateRaw);
              if (dateVal) {
                var dayVal = formatEnglishDay(String(dayRow[c] || "").trim());
                var dutyRaw = String(dutyRow[c] || "").replace("%", "").trim();
                var dateKey = dateVal.toLowerCase();
                var hasRealData = String(readyRow[c] || "").trim() || String(workingRow[c] || "").trim();
                if (!machinesMap[mName].dataMap[dateKey] || hasRealData) {
                  machinesMap[mName].dataMap[dateKey] = {
                    date: dateVal,
                    day: dayVal,
                    ready: formatTimeString(readyRow[c], true),
                    working: formatTimeString(workingRow[c]),
                    waiting: formatTimeString(waitingRow[c]),
                    standstill: formatTimeString(standstillRow[c]),
                    duty: dutyRaw === "" ? "" : (parseFloat(dutyRaw) || 0),
                    selected: true
                  };
                }
              }
            }
            r += 6;
          }
        }
      }

      var machinesList = machineOrder.map(function (mName) {
        var mObj = machinesMap[mName];
        var dataArr = Object.keys(mObj.dataMap).map(function (k) { return mObj.dataMap[k]; });
        dataArr.sort(function (a, b) {
          var da = parseSheetDateAny(a.date);
          var db = parseSheetDateAny(b.date);
          if (da && db) return da.getTime() - db.getTime();
          return 0;
        });
        return {
          name: mName,
          data: dataArr
        };
      });

      return ContentService.createTextOutput(JSON.stringify({
        "result": "success",
        "machines": machinesList
      })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({
        "result": "error",
        "message": err.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput("ROUTER Master Sheet Template & Date Matching Active! (Legacy CNC_ sheet names are migrated automatically)");
}