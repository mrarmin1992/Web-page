using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DogadjajKategorije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DogadjajKategorije", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FileUrl = table.Column<string>(type: "text", nullable: true),
                    FileName = table.Column<string>(type: "text", nullable: true),
                    OriginalFileName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KursKategorije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KursKategorije", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ObukaKategorije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ObukaKategorije", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Photos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PictureUrl = table.Column<string>(type: "text", nullable: true),
                    FileName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Photos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VijestKategorije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VijestKategorije", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Dogadjaji",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: true),
                    DogadjajKategorijaId = table.Column<int>(type: "integer", nullable: false),
                    Objavio = table.Column<string>(type: "text", nullable: true),
                    Opis = table.Column<string>(type: "text", nullable: true),
                    DatumObjave = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DatumPocetka = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    VrijemePocetka = table.Column<string>(type: "text", nullable: true),
                    PhotoId = table.Column<int>(type: "integer", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dogadjaji", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dogadjaji_DogadjajKategorije_DogadjajKategorijaId",
                        column: x => x.DogadjajKategorijaId,
                        principalTable: "DogadjajKategorije",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Dogadjaji_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Kursevi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Aktivan = table.Column<bool>(type: "boolean", nullable: false),
                    BrojPolaznika = table.Column<int>(type: "integer", nullable: false),
                    Cijena = table.Column<double>(type: "numeric(18,2)", nullable: false),
                    DatumObjave = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DatumPocetka = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    KursKategorijaId = table.Column<int>(type: "integer", nullable: false),
                    Objavio = table.Column<string>(type: "text", nullable: true),
                    Opis = table.Column<string>(type: "text", nullable: true),
                    KratakOpis = table.Column<string>(type: "text", nullable: true),
                    Trajanje = table.Column<int>(type: "integer", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    PhotoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kursevi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Kursevi_KursKategorije_KursKategorijaId",
                        column: x => x.KursKategorijaId,
                        principalTable: "KursKategorije",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Kursevi_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Obuke",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: true),
                    Aktivan = table.Column<bool>(type: "boolean", nullable: false),
                    BrojPolaznika = table.Column<int>(type: "integer", nullable: false),
                    Cijena = table.Column<double>(type: "double precision", nullable: false),
                    DatumObjave = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DatumPocetka = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ObukaKategorijaId = table.Column<int>(type: "integer", nullable: false),
                    Objavio = table.Column<string>(type: "text", nullable: true),
                    Opis = table.Column<string>(type: "text", nullable: true),
                    KratakOpis = table.Column<string>(type: "text", nullable: true),
                    Trajanje = table.Column<int>(type: "integer", nullable: false),
                    PhotoId = table.Column<int>(type: "integer", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Obuke", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Obuke_ObukaKategorije_ObukaKategorijaId",
                        column: x => x.ObukaKategorijaId,
                        principalTable: "ObukaKategorije",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Obuke_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Partneri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    Ime = table.Column<string>(type: "text", nullable: true),
                    Opis = table.Column<string>(type: "text", nullable: true),
                    Telefon = table.Column<string>(type: "text", nullable: true),
                    Fax = table.Column<string>(type: "text", nullable: true),
                    Mail = table.Column<string>(type: "text", nullable: true),
                    Adresa = table.Column<string>(type: "text", nullable: true),
                    Web = table.Column<string>(type: "text", nullable: true),
                    Facebook = table.Column<string>(type: "text", nullable: true),
                    Instagram = table.Column<string>(type: "text", nullable: true),
                    Tiktok = table.Column<string>(type: "text", nullable: true),
                    Youtube = table.Column<string>(type: "text", nullable: true),
                    Twitter = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    PhotoId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partneri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Partneri_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Publikacije",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naziv = table.Column<string>(type: "text", nullable: true),
                    Autor = table.Column<string>(type: "text", nullable: true),
                    DatumObjavljivanja = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Opis = table.Column<string>(type: "text", nullable: true),
                    Objavio = table.Column<string>(type: "text", nullable: true),
                    FajlId = table.Column<int>(type: "integer", nullable: true),
                    PhotoId = table.Column<int>(type: "integer", nullable: true),
                    Path = table.Column<string>(type: "text", nullable: true),
                    PhotoPath = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publikacije", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Publikacije_Files_FajlId",
                        column: x => x.FajlId,
                        principalTable: "Files",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Publikacije_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Vijesti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Naslov = table.Column<string>(type: "text", nullable: true),
                    Podnaslov = table.Column<string>(type: "text", nullable: true),
                    Datum = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Fokus = table.Column<bool>(type: "boolean", nullable: false),
                    Objavio = table.Column<string>(type: "text", nullable: true),
                    VijestKategorijaId = table.Column<int>(type: "integer", nullable: false),
                    Sadrzaj = table.Column<string>(type: "text", nullable: true),
                    PhotoId = table.Column<int>(type: "integer", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vijesti", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vijesti_Photos_PhotoId",
                        column: x => x.PhotoId,
                        principalTable: "Photos",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Vijesti_VijestKategorije_VijestKategorijaId",
                        column: x => x.VijestKategorijaId,
                        principalTable: "VijestKategorije",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Prijave",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Ime = table.Column<string>(type: "text", nullable: true),
                    Prezime = table.Column<string>(type: "text", nullable: true),
                    DatumRodjenja = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DatumPrijave = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Telefon = table.Column<string>(type: "text", nullable: true),
                    Zanimanje = table.Column<string>(type: "text", nullable: true),
                    Pogledano = table.Column<bool>(type: "boolean", nullable: false),
                    KursId = table.Column<int>(type: "integer", nullable: true),
                    ObukaId = table.Column<int>(type: "integer", nullable: true),
                    PrethodnoZnanje = table.Column<string>(type: "text", nullable: true),
                    Objava = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prijave", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Prijave_Kursevi_KursId",
                        column: x => x.KursId,
                        principalTable: "Kursevi",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Prijave_Obuke_ObukaId",
                        column: x => x.ObukaId,
                        principalTable: "Obuke",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dogadjaji_DogadjajKategorijaId",
                table: "Dogadjaji",
                column: "DogadjajKategorijaId");

            migrationBuilder.CreateIndex(
                name: "IX_Dogadjaji_PhotoId",
                table: "Dogadjaji",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_Kursevi_KursKategorijaId",
                table: "Kursevi",
                column: "KursKategorijaId");

            migrationBuilder.CreateIndex(
                name: "IX_Kursevi_PhotoId",
                table: "Kursevi",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_Obuke_ObukaKategorijaId",
                table: "Obuke",
                column: "ObukaKategorijaId");

            migrationBuilder.CreateIndex(
                name: "IX_Obuke_PhotoId",
                table: "Obuke",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_Partneri_PhotoId",
                table: "Partneri",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_Prijave_KursId",
                table: "Prijave",
                column: "KursId");

            migrationBuilder.CreateIndex(
                name: "IX_Prijave_ObukaId",
                table: "Prijave",
                column: "ObukaId");

            migrationBuilder.CreateIndex(
                name: "IX_Publikacije_FajlId",
                table: "Publikacije",
                column: "FajlId");

            migrationBuilder.CreateIndex(
                name: "IX_Publikacije_PhotoId",
                table: "Publikacije",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_Vijesti_PhotoId",
                table: "Vijesti",
                column: "PhotoId");

            migrationBuilder.CreateIndex(
                name: "IX_Vijesti_VijestKategorijaId",
                table: "Vijesti",
                column: "VijestKategorijaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dogadjaji");

            migrationBuilder.DropTable(
                name: "Partneri");

            migrationBuilder.DropTable(
                name: "Prijave");

            migrationBuilder.DropTable(
                name: "Publikacije");

            migrationBuilder.DropTable(
                name: "Vijesti");

            migrationBuilder.DropTable(
                name: "DogadjajKategorije");

            migrationBuilder.DropTable(
                name: "Kursevi");

            migrationBuilder.DropTable(
                name: "Obuke");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "VijestKategorije");

            migrationBuilder.DropTable(
                name: "KursKategorije");

            migrationBuilder.DropTable(
                name: "ObukaKategorije");

            migrationBuilder.DropTable(
                name: "Photos");
        }
    }
}
