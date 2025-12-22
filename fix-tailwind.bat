echo off
echo Cleaning up...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .next rmdir /s /q .next

echo Installing dependencies...
npm install

echo Done!
pause