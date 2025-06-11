//pakai "..." itu karena bisa menerima inputan role lebih dari 1.
//Rest parameter memungkinkan sebuah fungsi untuk menerima sejumlah argumen yang tidak terbatas dan mengumpulkannya menjadi sebuah array. Dalam contoh checkRoles(...allowedRoles), berapapun jumlah peran yang diberikan saat memanggil checkRoles (misalnya, checkRoles("admin", "editor"), checkRoles("superadmin", "admin", "viewer")), semuanya akan dimasukkan ke dalam array allowedRoles

const checkRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const rolesUser = req.pengguna.roles.split(",");
    const bolehMasuk = rolesUser
      .map((role) => {
        return allowedRoles.includes(role);
      })
      .find((value) => {
        return value === true;
      });

    if (!bolehMasuk) {
      return res.sendStatus(403); //forbidden
    }

    next();
  };
};

module.exports = checkRoles;
