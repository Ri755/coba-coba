const { Op, Sequelize } = require("sequelize");
const { Toko, Pengguna, Buku, KategoriBuku, TokoBuku } = require("../models");

const onetooneToko = async (req, res) => {
    const { toko_id } = req.params;

    // Eager Loading: pakaiquery
    //kenapa kok harus pakai number di toko_id?
    // const toko = await Toko.findByPk(Number(toko_id), { include: Pengguna });
    // return res.status(200).json(toko);

    // Lazy Loading:pakai get 
    const toko = await Toko.findByPk(Number(toko_id))
    return res.status(200).json({
        toko: toko,
        pengguna: await toko.getPengguna()
    })
};

const onetoonePengguna = async (req, res) => {
    const { pengguna_id } = req.params;

    // Eager Loading
    // const pengguna = await Pengguna.findByPk(Number(pengguna_id),{include:Toko})
    // return res.status(200).json(pengguna)

    // Lazy Loading
    const pengguna = await Pengguna.findByPk(Number(pengguna_id));
    return res.status(200).json({
        pengguna: pengguna,
        toko: await pengguna.getToko(),
    });
};

const onetomanyKategori = async (req, res) => {
    const { kategori_id } = req.params;

    // Eager Loading
    // const kategori = await KategoriBuku.findByPk(Number(kategori_id), {include:Buku})
    // return res.status(200).json(kategori)

    //Lazy Loading
    const kategori = await KategoriBuku.findByPk(Number(kategori_id));
    return res.status(200).json({
        kategori: kategori,
        buku: await kategori.getBuku(),
    });
};

const onetomanyBuku = async (req, res) => {
    const { buku_id } = req.params;

    // Eager Loading
    const buku = await Buku.findByPk(Number(buku_id), {
        include: KategoriBuku,
    });
    return res.status(200).json(buku);

    //Lazy Loading
    // const kategori = await KategoriBuku.findByPk(Number(kategori_id))
    // return res.status(200).json(
    //     {
    //         kategori: kategori,
    //         buku: await kategori.getBuku()
    //     }
    // )
};

const manytomanyToko = async (req, res) => {
    const { toko_id } = req.params;

    const toko = await Toko.findByPk(Number(toko_id), {
        attributes: ["toko_id", "toko_nama", "pengguna_id"],
        include: [
            {
                model: Buku,
                where: [{ buku_tahun_terbit: { [Op.gte]: 2000 } }],
                attributes: [
                    "buku_id",
                    "buku_nama",
                    [
                        //ubah jadi col caranya bagaimana?
                        Sequelize.literal("`buku->KategoriBuku`.kategori_nama"),
                        "kategori_nama",
                    ],
                    [Sequelize.literal("`buku->toko_buku`.tb_stok"), "tb_stok"],
                ],
                include: [
                    {
                        model: KategoriBuku,
                        attributes: [],
                    },
                ],
                through: { attributes: [] },
            },
        ],
    });

    const tambahan = toko.Buku.reduce((kalimat, item) => {
        kalimat.push(
            `Buku berjudul ${item.buku_nama} dengan stok : ${item.dataValues.tb_stok} \n`
        );
        return kalimat;
    }, []);

    return res.status(200).json({ data: toko, tambahan: tambahan });
};

const manytomanyBuku = async (req, res) => {
    const { buku_id } = req.params;

    //Lazy Loading
    const buku = await Buku.findByPk(Number(buku_id));
    if (!buku) {
        return res.status(404).json({ msg: "Buku tidak ditemukan" });
    } else {
        const tokos = await buku.getToko();

        const tambahan = tokos.reduce((kalimat, item) => {
            kalimat.push(
                `Dijual di toko ${item.toko_nama} dengan stok : ${item.toko_buku.tb_stok}`
            );
            return kalimat;
        }, []);
        return res.status(200).json({
            buku: buku,
            toko: tokos,
            tambahan: tambahan,
        });
    }
};

const kategoriCreateBuku = async (req, res) => {
    const { kategori_id } = req.params;
    const body = req.body;

    const kategori = await KategoriBuku.findByPk(kategori_id);
    if (!kategori) {
        return res.status(404).json({ msg: "Kategori tidak ditemukan" });
    } else {
        const result = await kategori.createBuku(body);
        return res.status(200).json(result);
    }
};

const createTokoBuku = async (req, res) => {
    try {
        const { toko_id } = req.params;
        const body = req.body;

        const toko = await Toko.findByPk(toko_id);
        if (!toko) {
            return res.status(404).json({ msg: "Toko tidak ditemukan" });
        }

        const buku = await Buku.findByPk(body.buku_id);
        if (!buku) {
            return res.status(404).json({ msg: "Buku tidak ditemukan" });
        }

        // untuk masang relasi sambil ngisi tabel pivot
        const result = await toko.addBuku(buku, {
            through: { tb_stok: body.tb_stok },
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in createTokoBuku:', error);
        return res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
};

module.exports = {
    onetooneToko,
    onetoonePengguna,
    onetomanyKategori,
    onetomanyBuku,
    manytomanyToko,
    manytomanyBuku,
    kategoriCreateBuku,
    createTokoBuku,
};
