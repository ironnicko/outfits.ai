sudo chmod a+w /home/ec2-user/.env

output+="\nVITE_PUBLIC_IP=http://$(curl -s ifconfig.me)"

echo -e $output >> .env