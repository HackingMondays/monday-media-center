var should = require("should");
import { FileSystemResource } from "../../../backend/services/FileSystemResource.js";

describe("FileSystemResource", () => describe("constructor", () => {
    it("accepts local file path in constructor", () => {
        new FileSystemResource("tests/data").ok;
    })
}));

describe("FileSystemResource", () => describe("constructor", () => {
    it("accepts file: url in constructor", () => {
        new FileSystemResource("file:tests/data").ok;
    })
}));

describe("FileSystemResource", () => describe("constructor", () => {
    it("raises an error if a non-file: URL is used", (done) => {
        try {
            new FileSystemResource("http://www.example.org/");
            throw new Error();
        } catch(err) {
            done();
        }
    })
}));

describe("FileSystemResource", () => describe("label", () => {
    it("label should be the basename with extension", () => {
        new FileSystemResource("file:tests/data/file1.txt").label.should.equal("file1.txt");
        new FileSystemResource("file:tests/data/file2").label.should.equal("file2");
        new FileSystemResource("file:tests/data/file3").label.should.equal("file3");
    })
}));

describe("FileSystemResource", () => describe("list", () => {
    it("list should return all the files and directories in the folder", (done) => {
        new FileSystemResource("tests/data").list((err,files) => {
            err.should.not.be.ok;
            files.length.should.equal(3);

            var labels = files.map((f) => f.label);
            ["file1.txt", "file2", "file3"].map((label) => labels.indexOf(label).should.not.equal(-1));
            done();
        });
    })
}));
