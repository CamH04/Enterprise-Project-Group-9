#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <zip.h>
#include <tinyxml2.h>

using namespace std;
using namespace tinyxml2;

string ExtractTextFromXML(const string& XmlContent) {
    XMLDocument Doc;
    Doc.Parse(XmlContent.c_str());
    XMLElement* Body = Doc.FirstChildElement("w:document")->FirstChildElement("w:body");
    if (Body) {
        stringstream TextStream;
        for (XMLElement* P = Body->FirstChildElement("w:p"); P != nullptr; P = P->NextSiblingElement("w:p")) {
            for (XMLElement* R = P->FirstChildElement("w:r"); R != nullptr; R = R->NextSiblingElement("w:r")) {
                XMLElement* T = R->FirstChildElement("w:t");
                if (T) {
                    const char* Text = T->GetText();
                    if (Text) {
                        TextStream << Text;
                    }
                }
            }
        }
        return TextStream.str();
    }
    return "";
}

string ReadDocxFile(const string& DocxFile) {
    int Err = 0;
    zip* DocxZip = zip_open(DocxFile.c_str(), 0, &Err);
    if (!DocxZip) {
        cerr << "Failed to open docx file" << endl;
        return "";
    }
    zip_file* DocFile = zip_fopen(DocxZip, "word/document.xml", 0);
    if (!DocFile) {
        cerr << "Failed to find document.xml in the DOCX file" << endl;
        zip_close(DocxZip);
        return "";
    }
    char Buffer[4096];
    stringstream Ss;
    int BytesRead = 0;
    while ((BytesRead = zip_fread(DocFile, Buffer, sizeof(Buffer))) > 0) {
        Ss.write(Buffer, BytesRead);
    }
    zip_fclose(DocFile);
    zip_close(DocxZip);
    return ExtractTextFromXML(Ss.str());
}

int main() {
    string inp;
    cin >> inp;
    string DocxFile = inp + ".docx";
    cout << DocxFile << endl;
    string Text = ReadDocxFile(DocxFile);
    if (!Text.empty()) {
        cout << "Extracted Text: " << endl << Text << endl;
    } else {
        cout << "No text extracted from the DOCX file" << endl;
    }
    return 0;
}
