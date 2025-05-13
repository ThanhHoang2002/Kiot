import axios from "axios"

// Cấu hình cho TTS
interface TtsConfig {
  apiKey: string
  speakerId: string
  speed: number
}
// Mặc định cấu hình
const DEFAULT_TTS_CONFIG: TtsConfig = {
  apiKey: import.meta.env.VITE_ZALO_APIKEY , // Thay thế bằng API key thực tế
  speakerId: "1", // Giọng nam miền Bắc (thay đổi theo nhu cầu)
  speed: 1.0 // Tốc độ bình thường
}

// Response từ Zalo API
interface ZaloTtsResponse {
  data: {
    url: string
  }
  error_message: string
  error_code: number
}

/**
 * Gọi API Zalo TTS để chuyển văn bản thành giọng nói
 * @param text Nội dung cần đọc
 * @param config Cấu hình TTS (optional)
 * @returns URL audio file
 */
export const getTextToSpeech = async (
  text: string,
  config: Partial<TtsConfig> = {}
): Promise<string> => {
  try {
    // Merge config với default
    const finalConfig = { ...DEFAULT_TTS_CONFIG, ...config }
    
    // Tạo dữ liệu form
    const formData = new URLSearchParams()
    formData.append("input", text)
    formData.append("speaker_id", finalConfig.speakerId)
    formData.append("speed", finalConfig.speed.toString())
    
    // Gọi API
    const response = await axios.post<ZaloTtsResponse>(
      "https://api.zalo.ai/v1/tts/synthesize",
      formData,
      {
        headers: {
          "apikey": finalConfig.apiKey,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    )
    
    // Kiểm tra lỗi
    if (response.data.error_code !== 0) {
      throw new Error(`Zalo TTS API error: ${response.data.error_message}`)
    }
    
    return response.data.data.url
  } catch (error) {
    console.error("Error calling Zalo TTS API:", error)
    throw error
  }
}

/**
 * Phát audio từ URL
 * @param audioUrl URL audio cần phát
 * @returns Promise resolved khi phát xong
 */
export const playAudio = (audioUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(audioUrl)
      
      // Sự kiện khi audio kết thúc
      audio.onended = () => {
        resolve()
      }
      
      // Sự kiện lỗi
      audio.onerror = (error) => {
        reject(error)
      }
      
      // Phát audio
      audio.play()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Kết hợp: Chuyển văn bản thành giọng nói và phát
 * @param text Nội dung cần đọc
 * @param config Cấu hình TTS (optional)
 */
export const speakText = async (
  text: string,
  config: Partial<TtsConfig> = {}
): Promise<void> => {
  try {
    const audioUrl = await getTextToSpeech(text, config)
    await playAudio(audioUrl)
  } catch (error) {
    console.error("Error speaking text:", error)
    // Không throw lỗi để không làm gián đoạn quy trình thanh toán
  }
} 