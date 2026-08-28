# Linux for Java & Spring Boot

---

## Syllabus 

- [ ] Installing JDK on Linux (`sudo apt install openjdk-17-jdk`)
- [ ] Verify Java installation (`java -version`, `javac -version`)
- [ ] Setting `JAVA_HOME` permanently in `~/.bashrc`
- [ ] Running a Spring Boot JAR (`java -jar app.jar`)
- [ ] Running with environment variables (`java -DPORT=8080 -jar app.jar`)
- [ ] Running Spring Boot in background (`nohup java -jar app.jar > app.log 2>&1 &`)
- [ ] Running Spring Boot as a systemd service (auto-start on reboot)
- [ ] Checking if Spring Boot is running (`ps -ef | grep java`)
- [ ] Finding which port Spring Boot is on (`sudo lsof -i :8080`)
- [ ] Reading Spring Boot logs (`tail -f application.log`)
- [ ] Stopping Spring Boot (`kill -9 <PID>`)
- [ ] Port conflict troubleshooting
- [ ] Passing `application.properties` values via environment variables
- [ ] Multiple environments (dev, staging, prod) on Linux
- [ ] JVM memory tuning (`-Xmx512m -Xms256m`)

