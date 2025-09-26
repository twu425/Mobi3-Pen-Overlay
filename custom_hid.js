const HID = require("node-hid");

function openCustomHid(VID = 0x239A, PID = 0x80F4) {
  const CUSTOM_USAGE_PAGE = 0xFF00;
  const CUSTOM_USAGE = 0x01;

  const devices = HID.devices(VID, PID);
  const customHidInfo = devices.find(
    d => d.usagePage === CUSTOM_USAGE_PAGE && d.usage === CUSTOM_USAGE
  );

  if (!customHidInfo) {
    throw new Error("Custom HID device not found");
  }

  const device = new HID.HID(customHidInfo.path);

  device.on("data", (data) => {
    const reportId = data.readUInt8(0);
    const x = data.readInt8(1);
    const y = data.readInt8(2);
    const z = data.readInt8(3);
    const buttons = data.readUInt8(4);
    const fx = data.readFloatLE(5);
    const fy = data.readFloatLE(9);
    const fz = data.readFloatLE(13);

    // Send HID report to renderer via callback
    if (openCustomHid.onReport) {
      openCustomHid.onReport({ reportId, x, y, z, buttons, fx, fy, fz });
    }
  });

  device.on("error", (err) => console.error("HID error:", err));
}

module.exports = { openCustomHid };
