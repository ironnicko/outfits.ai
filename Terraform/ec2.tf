# ec2.tf
data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "main" {
  vpc_id = data.aws_vpc.default.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  dynamic "ingress" {
    for_each = [22, 80, 443, 3000, 8000, 8001]
    content {
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  tags = {
    Name = "main-security-group"
  }
}

resource "aws_instance" "my_vm" {
  ami           = var.instance_ami
  instance_type = "t4g.small"
  key_name      = "vockey"

  vpc_security_group_ids = [aws_security_group.main.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  root_block_device {
    volume_size = 32
    volume_type = "gp2"
  }

  tags = {
    Name = "outfits.ai"
  }

  provisioner "remote-exec" {
    inline = ["echo 'wait until SSH is ready'"]

    connection {
      type        = "ssh"
      user        = var.ssh_user
      private_key = file(var.private_key_path)
      host        = self.public_ip
    }
  }

  provisioner "local-exec" {
    command = "ansible-playbook -i aws_ec2.yaml -u ${var.ssh_user} --private-key ${var.private_key_path} playbook.yaml"
  }
}

# outputs.tf (optional, but helpful)
output "instance_public_ip" {
  value = aws_instance.my_vm.public_ip
}