import { AspectRatio, CameraAngle, ConceptCategory, ConceptItem } from './types';

export const ASPECT_RATIOS = [
  { value: AspectRatio.Portrait, label: "9:16 (Di động)" },
  { value: AspectRatio.Landscape, label: "16:9 (Màn hình ngang)" },
  { value: AspectRatio.Square, label: "1:1 (Vuông)" },
];

export const CAMERA_ANGLES: CameraAngle[] = [
  { id: 'close-up', label: 'Cận cảnh (Close-up Shot)', prompt: 'Close-up shot, focusing on facial details and expressions' },
  { id: 'eye-level', label: 'Trung tính (Eye-level Shot)', prompt: 'Eye-level shot, natural perspective' },
  { id: 'low-angle', label: 'Góc máy thấp (Low Angle Shot)', prompt: 'Low angle shot, looking up at the subject, powerful stance' },
  { id: 'high-angle', label: 'Góc máy cao (High Angle Shot)', prompt: 'High angle shot, looking down slightly' },
  { id: 'over-shoulder', label: 'Ngang vai (Over-the-Shoulder Shot)', prompt: 'Over-the-shoulder shot, cinematic depth' },
  { id: 'medium', label: 'Trung cảnh (Medium Shot)', prompt: 'Medium shot, capturing subject from waist up' },
  { id: 'dutch', label: 'Góc nghiêng (Dutch Angle)', prompt: 'Dutch angle, tilted camera for dynamic effect' },
];

const NOEL_CONCEPTS: ConceptItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `noel-${i}`,
  label: `Bối cảnh Noel ${i + 1}: ${[
    "Bên cây thông rực rỡ", "Tuyết rơi lãng mạn ngoài phố", "Trong phòng khách ấm cúng", "Mặc đồ Ông già Noel", 
    "Cầm hộp quà xinh xắn", "Bên lò sưởi ấm áp", "Dạo phố đêm Giáng sinh", "Bên người tuyết đáng yêu",
    "Dưới ánh đèn lung linh", "Trong rừng thông phủ tuyết", "Tiệc tối Giáng sinh sang trọng", "Uống cacao nóng bên cửa sổ",
    "Trang trí cây thông", "Đội mũ len đỏ dễ thương", "Xe tuần lộc bay", "Ngôi nhà gỗ trong rừng",
    "Pháo hoa đêm Giáng sinh", "Chợ Giáng sinh Châu Âu", "Chuông vàng lấp lánh", "Thiên thần tuyết"
  ][i] || "Giáng sinh an lành"}`,
  prompt: [
    "Standing next to a magnificent Christmas tree with glowing lights", "Romantic snowy street scene with falling snow", "Cozy living room with Christmas decorations", "Wearing a Santa Claus costume",
    "Holding a beautiful gift box", "Sitting by a warm fireplace", "Walking on a street decorated for Christmas night", "Standing next to a cute snowman",
    "Illuminated by twinkling fairy lights", "In a pine forest covered in white snow", "At a luxurious Christmas dinner party", "Drinking hot cocoa by a frosty window",
    "Decorating a Christmas tree", "Wearing a cute red wool hat", "Riding a magical reindeer sleigh", "In front of a wooden cabin in snowy woods",
    "Watching fireworks on Christmas Eve", "At a bustling European Christmas market", "Surrounded by sparkling golden bells", "Dressed as a snow angel"
  ][i] || "Christmas theme"
}));

const TET_CONCEPTS: ConceptItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `tet-${i}`,
  label: `Bối cảnh Tết ${i + 1}: ${[
    "Mặc áo dài bên hoa mai", "Gói bánh chưng truyền thống", "Dạo chợ hoa Tết", "Bên câu đối đỏ",
    "Nhận lì xì may mắn", "Mâm ngũ quả ngày Tết", "Pháo hoa đêm giao thừa", "Đi lễ chùa đầu năm",
    "Vườn đào nở rộ", "Phố cổ Hội An ngày Tết", "Gia đình sum họp bên trà", "Thiếu nữ bên hoa cúc",
    "Chơi bầu cua tôm cá", "Ông đồ cho chữ", "Múa lân sư rồng", "Nấu bánh tét",
    "Đường hoa Nguyễn Huệ", "Áo dài cách tân hiện đại", "Bên tràng pháo đỏ", "Mâm cơm tất niên"
  ][i] || "Tết Việt Nam"}`,
  prompt: [
    "Wearing traditional Ao Dai standing next to yellow Mai flowers", "Wrapping traditional Banh Chung cake", "Walking in a vibrant Tet flower market", "Standing next to red couplets calligraphy",
    "Receiving lucky money (Li Xi) red envelopes", "With a traditional five-fruit tray", "Watching New Year's Eve fireworks", "Praying at a temple for New Year luck",
    "In a garden of blooming peach blossoms", "In Hoi An ancient town decorated for Tet", "Family gathering drinking tea", "Young woman posing with yellow chrysanthemums",
    "Playing traditional folk games", "Next to a calligraphy master giving letters", "Watching a Lion Dance performance", "Cooking Banh Tet by the fire",
    "Walking on Nguyen Hue flower street", "Wearing modern stylized Ao Dai", "Next to hanging red firecrackers", "Traditional Year-end dinner setting"
  ][i] || "Vietnamese Lunar New Year theme"
}));

const DU_XUAN_CONCEPTS: ConceptItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `duxuan-${i}`,
  label: `Du Xuân ${i + 1}: ${[
    "Đồi chè xanh mướt", "Vườn hoa hướng dương", "Trên thuyền dạo sông", "Cánh đồng hoa cải",
    "Đỉnh núi mây mù", "Thác nước hùng vĩ", "Bãi biển nắng vàng", "Rừng tràm trà sư",
    "Cầu kính trên mây", "Thung lũng tình yêu", "Đạp xe đường quê", "Cắm trại bên hồ",
    "Ruộng bậc thang lúa non", "Vườn dâu tây Đà Lạt", "Hang động kỳ vĩ", "Cung đường ven biển",
    "Làng chài bình minh", "Suối nước nóng tự nhiên", "Đồi cát bay", "Rừng nguyên sinh"
  ][i] || "Du xuân tươi mới"}`,
  prompt: [
    "Green tea hill landscape, fresh spring vibe", "Sunflowers garden in full bloom", "Riding a boat on a calm river", "Field of yellow mustard flowers",
    "Mountain peak above clouds", "Majestic waterfall scenery", "Sunny beach with golden sand", "Cajuput forest nature scene",
    "Glass bridge in the clouds", "Valley of Love romantic scene", "Cycling on a peaceful country road", "Camping by a serene lake",
    "Terraced rice fields with young green rice", "Strawberry garden in Dalat", "Mysterious magnificent cave", "Scenic coastal road trip",
    "Fishing village at sunrise", "Natural hot spring relaxation", "Sand dunes in the wind", "Lush primitive forest"
  ][i] || "Spring travel energetic vibe"
}));

const SUM_VAY_CONCEPTS: ConceptItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `sumvay-${i}`,
  label: `Sum Vầy ${i + 1}: ${[
    "Bữa cơm gia đình", "Xem Táo Quân", "Chụp ảnh đại gia đình", "Trò chuyện bên ấm trà",
    "Cùng nhau dọn nhà", "Về quê ăn Tết", "Đón khách đến chơi", "Ông bà và cháu",
    "Trao quà tết", "Cụng ly chúc mừng", "Quây quần bên lửa trại", "Chơi cờ tướng với ông",
    "Làm mứt tết", "Hái lộc đầu năm", "Chúc thọ ông bà", "Trẻ em vui đùa",
    "Cả nhà gói bánh", "Bữa sáng đầu năm", "Ngắm trăng rằm", "Đọc sách cùng con"
  ][i] || "Gia đình hạnh phúc"}`,
  prompt: [
    "Warm family dinner gathering", "Watching traditional Tet comedy show together", "Big family group photo", "Chatting happily around a tea table",
    "Cleaning the house together for Tet", "Returning to hometown for Tet", "Welcoming guests to the home", "Grandparents playing with grandchildren",
    "Exchanging Tet gifts", "Toasting cheers with glasses", "Gathering around a campfire", "Playing Chinese chess with grandfather",
    "Making traditional candied fruits", "Picking lucky buds in spring", "Wishing longevity to grandparents", "Children playing happily together",
    "Whole family wrapping cakes", "First breakfast of the New Year", "Watching the full moon", "Reading books with children"
  ][i] || "Family reunion warm atmosphere"
}));

const MUA_DONG_CONCEPTS: ConceptItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `muadong-${i}`,
  label: `Mùa Đông ${i + 1}: ${[
    "Khăn len ống ấm áp", "Áo khoác dạ dáng dài", "Giữa trời tuyết trắng", "Hơi thở hóa khói",
    "Cầm cốc cà phê nóng", "Đọc sách bên cửa sổ mưa", "Đi ủng da sành điệu", "Găng tay len dễ thương",
    "Chụp dưới ô trong tuyết", "Ánh nắng mùa đông yếu ớt", "Rừng cây lá kim", "Hồ nước đóng băng",
    "Áo len cổ lọ", "Mũ nồi phong cách", "Phố mùa đông vắng vẻ", "Đèn đường vàng ấm",
    "Ngồi ghế đá công viên", "Cho chim bồ câu ăn", "Tuyết rơi trên tóc", "Mùa đông Hà Nội"
  ][i] || "Mùa đông ấm áp"}`,
  prompt: [
    "Wearing a warm infinity scarf", "Wearing a stylish long wool coat", "Standing in the middle of white snow", "Breath turning into mist in cold air",
    "Holding a hot coffee cup", "Reading a book by a rainy window", "Wearing stylish leather boots", "Wearing cute wool gloves",
    "Under an umbrella in the snow", "Soft weak winter sunlight", "Conifer forest in winter", "Frozen lake surface",
    "Wearing a turtleneck sweater", "Wearing a stylish beret hat", "Quiet winter street", "Warm yellow street lights",
    "Sitting on a park bench", "Feeding pigeons in winter", "Snowflakes falling on hair", "Hanoi winter vibe"
  ][i] || "Warm winter fashion"
}));

export const CATEGORIES = {
  [ConceptCategory.Noel]: NOEL_CONCEPTS,
  [ConceptCategory.Tet]: TET_CONCEPTS,
  [ConceptCategory.DuXuan]: DU_XUAN_CONCEPTS,
  [ConceptCategory.SumVay]: SUM_VAY_CONCEPTS,
  [ConceptCategory.MuaDong]: MUA_DONG_CONCEPTS,
};