using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Ionic.Zip;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OSGeo.OGR;
using OSGeo.OSR;
using NetTopologySuite.IO;
using ProjNet.CoordinateSystems;

namespace IOTLink.Diachinh.Sevice
{
    public class GdalUtilities
    {
        public GdalUtilities()
        {
            GdalConfiguration.ConfigureGdal();
            GdalConfiguration.ConfigureOgr();
        }

        public bool convertJsonToShapeFile(string jsonFilePath, string shapeFilePath)
        {

            Driver jsonFileDriver = Ogr.GetDriverByName("GeoJSON");
            DataSource jsonFile = Ogr.Open(jsonFilePath, 0);
            if (jsonFile == null)
            {
                return false;
            }

            string filesPathName = shapeFilePath.Substring(0, shapeFilePath.Length - 4);
            removeShapeFileIfExists(filesPathName);

            Layer jsonLayer = jsonFile.GetLayerByIndex(0);

            Driver esriShapeFileDriver = Ogr.GetDriverByName("ESRI Shapefile");

            DataSource shapeFile = esriShapeFileDriver.CreateDataSource(shapeFilePath, new string[] { });
            Layer shplayer = shapeFile.CreateLayer(jsonLayer.GetName(), jsonLayer.GetSpatialRef(), jsonLayer.GetGeomType(), new string[] { });

            // create fields (properties) in new layer
            Feature jsonFeature = jsonLayer.GetNextFeature();
            for (int i = 0; i < jsonFeature.GetFieldCount(); i++)
            {
                //string type = jsonFeature.GetFieldDefnRef(i).GetTypeName();
                //if (type.ToLower()=="string")
                //{
                    string s = jsonFeature.GetFieldAsString(i).ToString();
                    //string value =Encoding.Default.GetString(StringToUtf8Bytes(s));
                    jsonFeature.SetField(i, s);
                //}
                FieldDefn fieldDefn = new FieldDefn(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldDefnRef(i).GetFieldType());
                shplayer.CreateField(fieldDefn, 1);
            }

            while (jsonFeature != null)
            {
                Geometry geometry = jsonFeature.GetGeometryRef();
                Feature shpFeature = createGeometryFromGeometry(geometry, shplayer, jsonLayer.GetSpatialRef());

                // copy values for each field
                for (int i = 0; i < jsonFeature.GetFieldCount(); i++)
                {
                    if (FieldType.OFTInteger == jsonFeature.GetFieldDefnRef(i).GetFieldType())
                    {
                        shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsInteger(i));
                    }
                    else if (FieldType.OFTReal == jsonFeature.GetFieldDefnRef(i).GetFieldType())
                    {
                        shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsDouble(i));
                    }
                    else
                    {
                        shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsString(i));
                    }
                }
                shplayer.SetFeature(shpFeature);

                jsonFeature = jsonLayer.GetNextFeature();
            }
            shapeFile.Dispose();
            jsonFile.Dispose();
            // if you want to generate zip of generated files
            string zipName = filesPathName + ".zip";
            CompressToZipFile(new List<string>() { shapeFilePath, filesPathName + ".dbf", filesPathName + ".prj", filesPathName + ".shx" }, zipName);

            return true;
        }
        public bool ConvertJsonToShapeFileNew(string json, string shapeFilePath, string namefile)
        {
            string geometryString = ConvertGeometryToString(json);
            var attributesTable = new NetTopologySuite.Features.AttributesTable();
            var attributes = AddAttribute(json);
            var geomFactory = new NetTopologySuite.Geometries.GeometryFactory(new NetTopologySuite.Geometries.PrecisionModel(), 4326);
            var wktReader = new WKTReader(geomFactory);
            var geometry = wktReader.Read(geometryString);
            string filesPathName = shapeFilePath.Substring(0, shapeFilePath.Length - 4);
            removeShapeFileIfExists(filesPathName);
            if (attributes != null)
            {
                attributesTable = attributes;
                var features = new List<NetTopologySuite.Features.IFeature>
                                {
                                    new NetTopologySuite.Features.Feature(geometry, attributesTable)
                                };
                var name = namefile.Substring(0, namefile.Length - 4);
                // Create the directory where we will save the shapefile
                //var shapeFilePath = Path.Combine(Server.MapPath("~/Document"), name);
                if (!Directory.Exists(filesPathName))
                    Directory.CreateDirectory(filesPathName);

                // Construct the shapefile name. Don't add the .shp extension or the ShapefileDataWriter will 
                // produce an unwanted shapefile
                var shapeFileName = Path.Combine(filesPathName, name);
                var shapeFilePrjName = Path.Combine(filesPathName, $"{name}.prj");

                // Create the shapefile
                var outGeomFactory = NetTopologySuite.Geometries.GeometryFactory.Default;
                var writer = new ShapefileDataWriter(shapeFileName, outGeomFactory, Encoding.UTF8);
                var outDbaseHeader = ShapefileDataWriter.GetHeader(features[0], features.Count, Encoding.UTF8);
                writer.Header = outDbaseHeader;
                writer.Write(features);

                // Create the projection file
                using (var streamWriter = new StreamWriter(shapeFilePrjName))
                {
                    streamWriter.Write(GeographicCoordinateSystem.WGS84.WKT);
                }
                System.IO.File.WriteAllText(Path.Combine(filesPathName, $"{name}.cpg"), Encoding.UTF8.HeaderName);
                //var shapeFileReader = new ShapefileDataReader(shapeFileName, NetTopologySuite.Geometries.GeometryFactory.Default, Encoding.UTF8);
                //var read = shapeFileReader.Read();
                //var values = new object[shapeFileReader.FieldCount - 1];
                //var a = values[1];
                //var a1 = shapeFileReader.GetName(0);
                //var geom = shapeFileReader.Geometry;

                string zipName = filesPathName + ".zip";
                CompressToZipFile(new List<string>() { shapeFileName + ".shp", shapeFileName + ".dbf", shapeFileName + ".prj", shapeFileName + ".shx", shapeFileName + ".cpg" }, zipName);
                return true;
            }
            return false;
        }
        public bool ConvertJsonToKML(dynamic json, string kmlFilePath)
        {
            try
            {
                var features = json.features;
                XmlWriterSettings settings = new XmlWriterSettings();
                settings.Indent = true;
                using (XmlWriter writer = XmlWriter.Create(kmlFilePath, settings))
                {
                    writer.WriteStartDocument();
                    //kml
                    writer.WriteStartElement("kml");
                    writer.WriteAttributeString("Company", "IOTLINK");
                    //Document
                    writer.WriteStartElement("Document");
                    foreach (var item in features)
                    {
                        //Placemark
                        writer.WriteStartElement("Placemark");
                        //ExtendedData
                        writer.WriteStartElement("ExtendedData");
                        foreach (var key in item["properties"])
                        {
                            var name = Convert.ToString(key.Name);
                            var value = Convert.ToString(key.Value);
                            if (!string.IsNullOrEmpty(name))
                            {
                                //Data
                                writer.WriteStartElement("Data");
                                writer.WriteAttributeString("name", name);
                                //Value
                                writer.WriteStartElement("value");
                                writer.WriteString(value);
                                writer.WriteEndElement();//End Value
                                writer.WriteEndElement();// End Data
                            }
                        }
                        writer.WriteEndElement();// End ExtendedData
                        //MultiGeometry
                        writer.WriteStartElement("MultiGeometry");
                        //polygon
                        writer.WriteStartElement("Polygon");
                        var coordinates = item["geometry"];
                        List<string> list = ConvertCoordinates(coordinates);
                        for (int i = 0; i < list.Count(); i++)
                        {
                            if (i == 0) writer.WriteStartElement("outerBoundaryIs");
                            else writer.WriteStartElement("innerBoundaryIs");
                            writer.WriteStartElement("LinearRing");
                            writer.WriteStartElement("coordinates");
                            writer.WriteString(list[i]);
                            writer.WriteEndElement();// End coordinates
                            writer.WriteEndElement();// End LinearRing
                            writer.WriteEndElement();// End outerBoundaryIs
                        }
                        writer.WriteEndElement();// End polygon
                        writer.WriteEndElement();// End MultiGeometry
                        writer.WriteEndElement();// End Placemark
                    }
                    writer.WriteEndElement();// End Document
                    writer.WriteEndElement();// End kml
                    writer.WriteEndDocument();
                    writer.Flush();
                }
                string filesPathName = kmlFilePath.Substring(0, kmlFilePath.Length - 4);
                // if you want to generate zip of generated files
                string zipName = filesPathName + ".zip";
                CompressToZipFile(new List<string>() { kmlFilePath }, zipName);
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private List<string> ConvertCoordinates(dynamic geometryDy)
        {
            List<string> list = new List<string>();
            string str = "";
            var geometry = (JObject)geometryDy;
            if (geometry["type"].ToString() == "LineString")
            {
                for (int j = 0; j < geometry["coordinates"].Count(); j++)
                {
                    str += (j == 0) ? String.Format("{0},{1}", geometry["coordinates"][j][0], geometry["coordinates"][j][1]) : String.Format(" {0},{1}", geometry["coordinates"][j][0], geometry["coordinates"][j][1]);
                }
                list.Add(str);
                return list;
            }
            else if (geometry["type"].ToString() == "Polygon")
            {
                str = "";
                for (int j = 0; j < geometry["coordinates"].Count(); j++)
                {
                    for (int k = 0; k < geometry["coordinates"][j].Count(); k++)
                    {
                        //geometry["coordinates"][j][k][1] = bl[0];
                        //geometry["coordinates"][j][k][0] = bl[1];
                        str += (k == 0) ? String.Format("{0},{1}", geometry["coordinates"][j][k][0], geometry["coordinates"][j][k][1]) : String.Format(" {0},{1}", geometry["coordinates"][j][k][0], geometry["coordinates"][j][k][1]);
                    }
                    list.Add(str);
                }
                return list;
            }
            else if (geometry["type"].ToString() == "MultiPolygon")
            {
                for (int j = 0; j < geometry["coordinates"].Count(); j++)
                {

                    for (int k = 0; k < geometry["coordinates"][j].Count(); k++)
                    {
                        str = "";
                        for (int l = 0; l < geometry["coordinates"][j][k].Count(); l++)
                        {
                            //double[] bl = MapTool.Coordinate.xyvn2000_2_blwgs84((double)geometry["coordinates"][j][k][l][1], (double)geometry["coordinates"][j][k][l][0], pdo, pphut, Convert.ToInt16(zone));

                            //geometry["coordinates"][j][k][l][1] = bl[0];
                            //geometry["coordinates"][j][k][l][0] = bl[1];
                            str += (l == 0) ? String.Format("{0},{1}", geometry["coordinates"][j][k][l][0], geometry["coordinates"][j][k][l][1]) : String.Format(" {0},{1}", geometry["coordinates"][j][k][l][0], geometry["coordinates"][j][k][l][1]);
                        }
                        list.Add(str);
                    }
                }
                return list;
            }
            return list;
        }

        public void removeShapeFileIfExists(string filesPathName)
        {
            removeFileIfExists(filesPathName + ".shp");
            removeFileIfExists(filesPathName + ".shx");
            removeFileIfExists(filesPathName + ".prj");
            removeFileIfExists(filesPathName + ".dbf");
        }

        public static bool removeFileIfExists(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
            return false;
        }

        // the field names in shapefile have limit of 10 characteres
        private string getValidFieldName(FieldDefn fieldDefn)
        {
            string fieldName = fieldDefn.GetName();
            //string valuname = fieldDefn.GetDefault();
            //var valuname1 = fieldDefn.GetFieldType();
            //var valuname2 = fieldDefn.GetJustify();
            //string valuname3 = fieldDefn.GetTypeName();
            //string valuname4 = fieldDefn.GetNameRef();
            //var valuname5 = fieldDefn.GetSubType();
            //var valuname6 = fieldDefn.GetType();
            return fieldName.Length > 10 ? fieldName.Substring(0, 10) : fieldName;
        }

        private Feature createGeometryFromGeometry(Geometry geometry, Layer layer, SpatialReference reference)
        {
            Feature feature = new Feature(layer.GetLayerDefn());

            string wktgeometry = "";
            geometry.ExportToWkt(out wktgeometry);
            Geometry newGeometry = Geometry.CreateFromWkt(wktgeometry);
            newGeometry.AssignSpatialReference(reference);
            //newGeometry.SetPoint(0, geometry.GetX(0), geometry.GetY(0), 0);
            //newGeometry.se
            newGeometry.AddGeometry(geometry);
            feature.SetGeometry(newGeometry);
            layer.CreateFeature(feature);

            return feature;
        }

        public static void CompressToZipFile(List<string> files, string zipPath)
        {
            using (ZipFile zip = new ZipFile())
            {
                foreach (string file in files)
                {
                    zip.AddFile(file, "");
                }
                zip.Save(zipPath);
            }
        }

        // Layer shplayer = shapeFile.CreateLayer("name", convertWgs84ToSirgas2000UtmZone24(), wkbGeometryType.wkbPoint, new string[] { });
        public double[] convertWgs84ToSirgas2000UtmZone24(double x, double y)
        {
            SpatialReference currentReference = getWgs84Reference();
            SpatialReference newReference = getSirgas2000UtmZone24ReferenceInCentimeters();

            CoordinateTransformation ct = new CoordinateTransformation(currentReference, newReference);
            double[] point = new double[2] { x, y };
            ct.TransformPoint(point);

            return point;
        }

        public static SpatialReference getSirgas2000UtmZone24ReferenceInCentimeters()
        {
            SpatialReference reference = new SpatialReference("");
            string ppszInput = "PROJCS[\"UTM_Zone_24_Southern_Hemisphere\",GEOGCS[\"GCS_GRS 1980(IUGG, 1980)\",DATUM[\"unknown\",SPHEROID[\"GRS80\",6378137,298.257222101]],PRIMEM[\"Greenwich\",0],UNIT[\"Degree\",0.017453292519943295]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"latitude_of_origin\",0],PARAMETER[\"central_meridian\",-39],PARAMETER[\"scale_factor\",0.9996],PARAMETER[\"false_easting\",50000000],PARAMETER[\"false_northing\",1000000000],UNIT[\"Centimeter\",0.01]]";
            reference.ImportFromWkt(ref ppszInput);

            return reference;
        }

        public static SpatialReference getSirgas2000UtmZone24Reference()
        {
            SpatialReference reference = new SpatialReference("");
            string epsg_31984_sirgas_proj4 = @"+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
            reference.ImportFromProj4(epsg_31984_sirgas_proj4);

            return reference;
        }

        public static SpatialReference getWgs84Reference()
        {
            string epsg_wgs1984_proj4 = @"+proj=latlong +datum=WGS84 +no_defs";
            SpatialReference reference = new SpatialReference("");
            reference.ImportFromProj4(epsg_wgs1984_proj4);

            return reference;
        }

        private List<double[]> readImageCoordinatesBoundsInLonLat(OSGeo.GDAL.Dataset imageDataset)
        {
            var band = imageDataset.GetRasterBand(1);
            if (band == null)
            {
                return null;
            }

            var width = band.XSize;
            var height = band.YSize;

            double[] geoTransformerData = new double[6];
            imageDataset.GetGeoTransform(geoTransformerData);


            SpatialReference currentReference = new SpatialReference(imageDataset.GetProjectionRef());
            SpatialReference newReference = GdalUtilities.getWgs84Reference();
            CoordinateTransformation ct = new CoordinateTransformation(currentReference, newReference);

            double[] northWestPoint = new double[2] { geoTransformerData[0], geoTransformerData[3] };
            ct.TransformPoint(northWestPoint);

            double[] southEastPoint = new double[2] {
                geoTransformerData[0] + geoTransformerData[1] * width,
                geoTransformerData[3] + geoTransformerData[5] * height
            };
            ct.TransformPoint(southEastPoint);


            return new List<double[]> { northWestPoint, southEastPoint };
        }
        private byte[] StringToUtf8Bytes(string str)
        {
            if (str == null)
            {
                return null;
            }

            Encoding encoder = Encoding.UTF8;
            int strLen = str.Length;
            int nativeLength = encoder.GetMaxByteCount(strLen);
            byte[] bytes = new byte[nativeLength + 1]; // zero terminated
            encoder.GetBytes(str, 0, str.Length, bytes, 0);
            return bytes;
        }

        private string ConvertGeometryToString(string jsonShape)
        {
            if (IsValidJson(jsonShape))
            {
                var obj = JObject.Parse(jsonShape);
                if (obj.Count > 0)
                {
                    var features = obj["features"];
                    var properties = features[0]["properties"];
                    var geometry = features[0]["geometry"];
                    var coordination = geometry["coordinates"];
                    string strGeometry = "";
                    if (geometry["type"].ToString().ToLower() == "MultiPolygon".ToLower())
                    {
                        strGeometry += "MULTIPOLYGON(";
                        for (int i = 0; i < coordination.Count(); i++) //array 1
                        {
                            strGeometry += i == 0 ? "(" : ",(";
                            for (int j = 0; j < coordination[i].Count(); j++)
                            {
                                strGeometry += j == 0 ? "(" : ",(";
                                for (int z = 0; z < coordination[i][j].Count(); z++)
                                {
                                    if (z != 0)
                                    {
                                        strGeometry += ", ";
                                    }
                                    strGeometry += (coordination[i][j][z][0].ToString() + " " + coordination[i][j][z][1].ToString());
                                }
                                strGeometry += ")";
                            }
                            strGeometry += ")";
                        }
                        strGeometry += ")";
                        return strGeometry;
                    }
                    if (geometry["type"].ToString().ToLower() == "Polygon".ToLower())
                    {
                        strGeometry += "POLYGON (";
                        for (int i = 0; i < coordination.Count(); i++) //array 1
                        {
                            strGeometry += i == 0 ? "(" : ",(";
                            for (int j = 0; j < coordination[i].Count(); j++)
                            {
                                if (j != 0)
                                {
                                    strGeometry += ", ";
                                }
                                strGeometry += (coordination[i][j][0].ToString() + " " + coordination[i][j][1].ToString());
                            }
                            strGeometry += ")";
                        }
                        strGeometry += ")";
                        return strGeometry;
                    }
                }
            }
            return "";
        }
        private NetTopologySuite.Features.AttributesTable AddAttribute(string jsonShape)
        {
            try
            {
                NetTopologySuite.Features.AttributesTable attributesTable = new NetTopologySuite.Features.AttributesTable();
                if (IsValidJson(jsonShape))
                {
                    var obj = JObject.Parse(jsonShape);
                    if (obj.Count > 0)
                    {
                        var features = obj["features"];
                        var properties = (JObject)features[0]["properties"];
                        attributesTable.AddAttribute("ObjectId", Convert.ToInt32(properties["ObjectId"].ToString()));
                        attributesTable.AddAttribute("UUID", properties["UUID"].ToString());
                        attributesTable.AddAttribute("MaXa", properties["MaXa"].ToString());
                        attributesTable.AddAttribute("MaDoiTuong", properties["MaDoiTuong"].ToString());
                        attributesTable.AddAttribute("SoHieuTo", (properties["SoHieuToBanDo"] != null) ? Convert.ToInt32(properties["SoHieuToBanDo"].ToString()) : 0);
                        attributesTable.AddAttribute("SoThua", (properties["SoThuTuThua"] != null) ? Convert.ToInt32(properties["SoThuTuThua"].ToString()) : 0);
                        attributesTable.AddAttribute("DienTich", (properties["DienTich"] != null) ? Convert.ToDouble(properties["DienTich"].ToString()) : 0);
                        attributesTable.AddAttribute("DTPhapLy", (properties["DienTichPhapLy"] != null) ? Convert.ToDouble(properties["DienTichPhapLy"].ToString()) : 0);
                        attributesTable.AddAttribute("KyHieuMDSD", properties["KyHieuMucDichSuDung"].ToString());
                        attributesTable.AddAttribute("TenChu", properties["TenChu"].ToString());
                        attributesTable.AddAttribute("DiaChi", properties["DiaChi"].ToString());
                        attributesTable.AddAttribute("ShapeArea", (properties["ShapeArea"] != null && properties["ShapeArea"].ToString() != "") ? Convert.ToDouble(properties["ShapeArea"].ToString()) : 0);
                        attributesTable.AddAttribute("Id", properties["Id"].ToString());
                        attributesTable.AddAttribute("TenChu2", properties["TenChu2"].ToString());

                    }
                }
                return attributesTable;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private NetTopologySuite.Features.AttributesTable AddAttribute(Models.ShapeJsonViewModel.Properties properties)
        {
            try
            {
                NetTopologySuite.Features.AttributesTable attributesTable = new NetTopologySuite.Features.AttributesTable();
                attributesTable.AddAttribute("ObjectId", properties.ObjectId);
                attributesTable.AddAttribute("Index", properties.Index);
                attributesTable.AddAttribute("UUID", properties.UUID != null ? properties.UUID : "");
                attributesTable.AddAttribute("ThoiDiemBa", properties.ThoiDiemBatDau != null ? properties.ThoiDiemBatDau : "");
                attributesTable.AddAttribute("ThoiDiemKe", properties.ThoiDiemKetThuc != null ? properties.ThoiDiemKetThuc : "");
                attributesTable.AddAttribute("MaXa", properties.MaXa != null ? properties.MaXa : "");
                attributesTable.AddAttribute("MaDoiTuong", properties.MaDoiTuong != null ? properties.MaDoiTuong : "");
                attributesTable.AddAttribute("SoHieuToBa", properties.SoHieuToBanDo);
                attributesTable.AddAttribute("SoThuTuThu", properties.SoThuTuThua);
                attributesTable.AddAttribute("SoHieuTo_1", properties.SoHieuToBanDoCu != null ? properties.SoHieuToBanDoCu : "");
                attributesTable.AddAttribute("SoThuTuT_1", properties.SoThuTuThuaCu != null ? properties.SoThuTuThuaCu : "");
                attributesTable.AddAttribute("DienTich", properties.DienTich);
                attributesTable.AddAttribute("DienTichPh", properties.DienTichPhapLy);
                attributesTable.AddAttribute("KyHieuMucD", properties.KyHieuMucDichSuDung != null ? properties.KyHieuMucDichSuDung : "");
                attributesTable.AddAttribute("KyHieuDoiT", properties.KyHieuDoiTuong != null ? properties.KyHieuDoiTuong : "");
                attributesTable.AddAttribute("TenChu", properties.TenChu != null ? properties.TenChu : "");
                attributesTable.AddAttribute("DiaChi", properties.DiaChi != null ? properties.DiaChi : "");
                attributesTable.AddAttribute("DaCapGCN", properties.DaCapGCN);
                attributesTable.AddAttribute("TenChu2", properties.TenChu2 != null ? properties.TenChu2 : "");
                attributesTable.AddAttribute("NamSinhC1", properties.NamSinhC1 != null ? properties.NamSinhC1 : "");
                attributesTable.AddAttribute("SoHieuGCN", properties.SoHieuGCN != null ? properties.SoHieuGCN : "");
                attributesTable.AddAttribute("SoVaoSo", properties.SoVaoSo != null ? properties.SoVaoSo : "");
                attributesTable.AddAttribute("NgayVaoSo", properties.NgayVaoSo != null ? properties.NgayVaoSo : "");
                attributesTable.AddAttribute("SoBienNhan", properties.SoBienNhan != null ? properties.SoBienNhan : "");
                attributesTable.AddAttribute("NguoiNhanH", properties.NguoiNhanHS != null ? properties.NguoiNhanHS : "");
                attributesTable.AddAttribute("CoQuanThuL", properties.CoQuanThuLy != null ? properties.CoQuanThuLy : "");
                attributesTable.AddAttribute("LoaiHS", properties.LoaiHS != null ? properties.LoaiHS : "");
                attributesTable.AddAttribute("MaLienKet", properties.MaLienKet != null ? properties.MaLienKet : "");
                attributesTable.AddAttribute("ShapeSTAre", properties.ShapeSTArea != null ? properties.ShapeSTArea : "");
                attributesTable.AddAttribute("ShapeSTLen", properties.ShapeSTLength != null ? properties.ShapeSTLength : "");
                attributesTable.AddAttribute("ShapeLengt", properties.ShapeLength != null ? properties.ShapeLength : "");
                attributesTable.AddAttribute("ShapeArea", properties.ShapeArea != null ? properties.ShapeArea : "");
                attributesTable.AddAttribute("info", properties.info != null ? properties.info : "");
                attributesTable.AddAttribute("Tags", properties.Tags != null ? properties.Tags : "");
                attributesTable.AddAttribute("Id", properties.Id != null ? properties.Id : "");
                attributesTable.AddAttribute("CreatedDat", properties.CreatedDate);
                attributesTable.AddAttribute("UpdatedDat", properties.UpdatedDate);
                attributesTable.AddAttribute("TenMucDich", properties.TenMucDichSuDung != null ? properties.TenMucDichSuDung : "");
                return attributesTable;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        private bool IsValidJson(string strInput)
        {
            strInput = strInput.Trim();
            if ((strInput.StartsWith("{") && strInput.EndsWith("}")) || //For object
                (strInput.StartsWith("[") && strInput.EndsWith("]"))) //For array
            {
                try
                {
                    var obj = JToken.Parse(strInput);
                    return true;
                }
                catch (JsonReaderException jex)
                {
                    //Exception in parsing json
                    Console.WriteLine(jex.Message);
                    return false;
                }
                catch (Exception ex) //some other exception
                {
                    Console.WriteLine(ex.ToString());
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }
}