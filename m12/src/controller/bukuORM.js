const { Op, Sequelize } = require("sequelize");
const {
  Buku,
  KategoriBuku,
  Toko,
  TokoBuku,
  Pengguna,
} = require("../models/index");

const qSederhana = async (req, res) => {
  try {

    //findAll=select * from buku;
    //order harus dalam array karena bisa lebih satu untuk ordernya.
    //where wajib dalam bentuk object karena bisa banyak case yang diperiksa.
    // const results = await Buku.findAll({
    //   limit: 5,
    //   offset: 3,
    //   order: [["buku_id", "ASC"]],
    // });
    // return res.status(200).json(results);

    //klo mau flexibel untuk pindah-pindah halamannya, bisa gunakan:
    // let page=2;//ambil buku di halaman ke 2
    // let size=3 //sebanyak 3
    // //let { page, size } = req.query;
    // page = parseInt(page) || 1; // Default page = 1
    // size = parseInt(size) || 5; // Default size = 5

    // const offset = (page - 1) * size; // Hitung offset berdasarkan page

    // const result = await Buku.findAll({
    // limit: size,
    // offset: offset,
    // order: [["buku_id", "ASC"]],
    // });
    // return res.status(200).json(result);
    
    //GET: Menghitung Total Buku
    //const total = await Buku.count();
    //return res.status(200).json({ total_buku: total });
    
    //GET: Menghitung Jumlah Buku yang Terbit Setelah Tahun 2020
    // const total = await Buku.count({ where: { buku_tahun_terbit: { [Op.gt]: 2020 } } });
    // return res.status(200).json({ total_buku_setelah_2000: total });

    //GET: Mencari Tahun Terbit Tertua dan Terbaru
    // const minYear = await Buku.min("buku_tahun_terbit");
    // const maxYear = await Buku.max("buku_tahun_terbit");
    // return res.status(200).json({
    // tahun_terbit_terlama: minYear,
    // tahun_terbit_terbaru: maxYear,
    // });

    //GET: Menghitung Rata-rata Tahun Terbit Buku
    // const avgYear = await Buku.findOne({
    //     attributes: [
    //       [Sequelize.fn("AVG", Sequelize.col("buku_tahun_terbit")), "rata_rata_tahun_terbit"]
    //     ],
    //   });
    //   return res.status(200).json(avgYear);

    //GET: Mengelompokkan Buku Berdasarkan Tahun Terbit
    // const result = await Buku.findAll({
    //     attributes: [
    //       "buku_tahun_terbit",
    //       [Sequelize.fn("COUNT", Sequelize.col("buku_id")), "jumlah_buku"]
    //     ],
    //     group: ["buku_tahun_terbit"],
    //     order: [["buku_tahun_terbit", "desc"]]
    //   });
    //   return res.status(200).json(result);
    
    
    //ganti-ganti variabel di sini
    let keyword = "th";
    let limit = 5;
    let offset = 3;
    let tahun_terbit_awal = 2018;
    let tahun_terbit_akhir = 2022;

    //jika ingin minta variabel dari body juga bisa:
    //const { keyword, limit, offset, tahun_terbit_awal, tahun_terbit_akhir } =req.query;
    
    if (keyword !== undefined || (tahun_terbit_awal !== undefined && tahun_terbit_akhir !== undefined) || (limit !== undefined && offset !== undefined)) 
      {
        let processKeyword = keyword || "";
        processKeyword = `%${processKeyword}%`;
        let processOffset = offset || 0;
        let processLimit = limit || 0;
        console.log(keyword,limit, offset,tahun_terbit_akhir, tahun_terbit_awal);
        let results;
        if (processLimit === 0) {
          results = await Buku.findAll({
            where: {
              [Op.or]: [
                {
                  buku_nama: {
                    [Op.like]: processKeyword,
                  },
                },
                {
                  buku_tahun_terbit: {
                    [Op.gte]: Number(tahun_terbit_awal),
                    [Op.lte]: Number(tahun_terbit_akhir),
                  },
                },
              ],
            },
            attributes: ["buku_nama", "buku_tahun_terbit", "keterangan_lengkap"],
          });
        } else {
          results = await Buku.findAll({
            where: {
              [Op.or]: [
                {
                  buku_nama: {
                    [Op.like]: processKeyword,
                  },
                },
                {
                  buku_tahun_terbit: {
                    [Op.gte]: Number(tahun_terbit_awal),
                    [Op.lte]: Number(tahun_terbit_akhir),
                  },
                },
              ],
            },
            attributes: ["buku_nama", "buku_tahun_terbit", "keterangan_lengkap"],
            limit: Number(processLimit),
            offset: Number(processOffset),
          });
        }

        if (results.length < 1) {
          return res.status(200).json({
            msg: "Tidak buku yang cocok dengan keyword, offset, dan limit yang anda masukkan",
          });
        } else {
          return res.status(200).json(results);
        }
      } else {
        const results = await Buku.findAll({
          order: [["buku_id", "desc"]],
          attributes: [
            "buku_id",
            "buku_nama",
            "buku_tahun_terbit",
            "keterangan_lengkap",
            [
              Sequelize.cast(
                Sequelize.fn("SUM", Sequelize.col("`Toko->toko_buku`.tb_stok")),
                "UNSIGNED"
              ),
              "jumlahStok",
            ],
          ],
          include: [
            {
              model: Toko,
              attributes: [],
            },
          ],
          group: ["buku_id"],
        });

        if (results.length < 1) {
          return res.status(404).json({ msg: "Tidak ada data buku" });
        } else {
          return res.status(200).json(results);
        }
      }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
  console.log("masuk 1");
};

const iqSederhana = async (req, res) => {
  try {
    const results = await Buku.create({
      buku_nama: "The Alchemist",
      buku_tahun_terbit: 1988,
      kategori_id: 2,
    });
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const uqSederhana = async (req, res) => {
  try {
    const { buku_id } = req.params;
    const results = await Buku.update(
      {
        buku_nama: "The Broings",
        buku_tahun_terbit: 2000,
      },
      {
        where: { buku_id: buku_id },
      }
    );

    if (results[0] === 0) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    return res.status(200).json({ message: "Buku berhasil diperbarui" });

    //update dengan findbyPK
    // const { buku_id } = req.params;
    // const { buku_nama, buku_tahun_terbit, kategori_id } = req.body;

    // const bukuYgDiupdate = await Buku.findByPk(buku_id);

    // if (!bukuYgDiupdate) {
    //     return res.status(400).send({ msg: "Buku tidak ditemukan" });
    // }
    // const result = await bukuYgDiupdate.update({
    //     buku_nama: buku_nama,
    //     buku_tahun_terbit: buku_tahun_terbit,
    //     kategori_id: kategori_id,
    // });
    // return res.status(200).send({ msg: "Berhasil Update" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const dqSederhana = async (req, res) => {
  try {
    const { buku_id } = req.params;
    const results = await Buku.destroy({
      where: { buku_id: buku_id },
    });

    if (results[0] === 0) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    return res.status(200).json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  //delete dengan findbyPK
  // const { buku_id } = req.params;
  // const bukuYgDihapus = await Buku.findByPk(buku_id);
  // if (!bukuYgDihapus) {
  //     return res.status(400).send({ msg: "Buku tidak ditemukan" });
  // }
  // const result = await bukuYgDihapus.destroy();
  // return res.status(200).send({ msg: "Buku dihapus" });
};

module.exports = {
  qSederhana,
  iqSederhana,
  uqSederhana,
  dqSederhana,
};
