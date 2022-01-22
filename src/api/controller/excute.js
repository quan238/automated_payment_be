import { exec } from 'child_process'

async function excuteSelenium(req, res) {
    const { user, clientCode, bank } = req.body
    try {
        exec(`node src/api/service/selenium.js ${user.email} ${user.password} "${clientCode}" ${bank.cardNumber} "${bank.cardName}" "${bank.cardExpiration}" "${bank.cardPass}"`, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                console.log(err)
                return;
            }

            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });

        return res.status(200).json({ success: true });
    } catch (e) {
        console.log(e)
    }
}

export const execute = {
    excuteSelenium
}