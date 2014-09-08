var should = require("should");
var path = require("path");
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

describe("FileSystemResource", () => describe("list", () => {
    it("list on a file returns err=true", (done) => {
        new FileSystemResource("tests/data/file1.txt").list((err,files) => {
            err.should.be.ok;
            done();
        });
    })
}));

describe("FileSystemResource", () => describe("list", () => {
    it("list on a file returns err=true even with chroot", (done) => {
        new FileSystemResource("tests/data/file1.txt", {chroot:true, chrootBase: ".."}).list((err,files) => {
            err.should.be.ok;
            done();
        });
    })
}));

describe("FileSystemResource", () => describe("list", () => {
    it("list on a non-existing path returns err=true", (done) => {
        new FileSystemResource("tests/not_existing_dir").list((err,files) => {
            err.should.be.ok;
            done();
        });
    })
}));

describe("FileSystemResource", () => describe("list", () => {
    it("list on a non-existing path returns err=true event with chroot", (done) => {
        new FileSystemResource("tests/not_existing_dir", {chroot:true, chrootBase: ".."}).list((err,files) => {
            err.should.be.ok;
            done();
        });
    })
}));

describe("FileSystemResource", () => describe("list", () => {
    it("with chroot disabled should show parent", (done) => {
        new FileSystemResource("tests/data", {chroot:false}).list((err,files) => {
            err.should.not.be.ok;
            files.length.should.equal(4);

            var labels = files.map((f) => f.label);
            ["file1.txt", "file2", "file3", "[parent]"].map((label) => labels.indexOf(label).should.not.equal(-1));
            done();
        });
    })
}));

describe("FileSystemResource", () => describe("list", () => {
    it("respects the chrootBase option", (done) => {
        new FileSystemResource("tests/data", {chroot:false, chrootBase: "./tests"}).list((err,files) => {
            err.should.not.be.ok;
            files.length.should.equal(4);
            var labels = files.map((f) => f.label);
            ["file1.txt", "file2", "file3", "[parent]"].map((label) => labels.indexOf(label).should.not.equal(-1));

            var parentRes = files.filter((f) => f.label == "[parent]")[0];
            parentRes.list((err,files) => {
                files.length.should.equal(2);
                var labels = files.map((f) => f.label);
                ["data", "backend"].map((label) => labels.indexOf(label).should.not.equal(-1));
                done();
            });
        });
    })
}));

describe("FileSystemResource", () => describe("list", () => {
    it("chroot option sets chrootBase if not set", () => {
        var absPath = path.resolve("./tests/data");
        new FileSystemResource(absPath, {chroot:false}).options.should.not.have.property("chrootBase");
        new FileSystemResource(absPath, {chroot:true}).options.should.have.property("chrootBase", absPath);
    })
}));

describe("FileSystemResource", () => describe("list", () => {
    it("chroot option should not overwrite chrootBase", () => {
        var absPath = path.resolve("./tests/data");
        var foobarPath = path.resolve("./FOOBAR");
        new FileSystemResource(absPath, {chroot:true, chrootBase: foobarPath}).options.should.have.property("chrootBase", foobarPath);
    })
}));

