use serde::{Deserialize, Serialize};
use serialport::available_ports;

#[derive(Debug, Serialize, Deserialize)]
pub struct SerialPortInfo {
    pub path: String,
    pub manufacturer: Option<String>,
    pub vendor_id: Option<String>,
    pub product_id: Option<String>,
}

#[derive(Debug, Serialize, thiserror::Error)]
pub enum SerialError {
    #[error("Failed to list ports: {0}")]
    ListError(String),
}

#[tauri::command]
pub fn list_ports() -> Result<Vec<SerialPortInfo>, SerialError> {
    let ports = available_ports().map_err(|e| SerialError::ListError(e.to_string()))?;

    Ok(ports
        .into_iter()
        // Only include USB ports (real hardware), filter out legacy /dev/ttyS* ports
        .filter(|port| matches!(port.port_type, serialport::SerialPortType::UsbPort(_)))
        .map(|port| {
            let (manufacturer, vendor_id, product_id) = match port.port_type {
                serialport::SerialPortType::UsbPort(info) => (
                    info.manufacturer,
                    Some(format!("{:04X}", info.vid)),
                    Some(format!("{:04X}", info.pid)),
                ),
                _ => (None, None, None),
            };

            SerialPortInfo {
                path: port.port_name,
                manufacturer,
                vendor_id,
                product_id,
            }
        })
        .collect())
}
